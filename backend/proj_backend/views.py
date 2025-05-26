from datetime import datetime
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.exceptions import PermissionDenied
from proj_backend.serializers import MyTokenObtainPairSerializer, UserSerializer, TeamsSerializer, FileUploadSerializer, PaymentSerializer, TaskSerializer
import cloudinary.uploader  # Cloudinary uploader for API-based uploads
from proj_backend.models import Payment, UserData, Team, Task

cloudinary.config(
    cloud_name='dgucrlzlw',
    api_key='147227354924822',
    api_secret='3k8AMZpov1DxAz9_Zj4_JVvWj_8',
)

MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

class Test(APIView):
    def get(self, request):
        return Response(data={"test": "test"}, status=200)


class RegisterView(APIView):
    def post(self, request):
        user_type = request.data.get('user_type')

        if user_type not in ['employee', 'manager']:
            return Response(data={"error": "Only employee and manager users can be registered"}, status=400)

        # Include the `user_type` in the data passed to the serializer as `type`
        data = request.data.copy()
        data['type'] = user_type  # Map `user_type` to `type` field expected by the serializer

        serializer = UserSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    

class ProfileView(APIView):
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class MyProfile(APIView):
    def get(self, request):
        email = request.GET.get('email')
        if email:
            try:
                # Retrieve user data based on the provided email
                user = UserData.objects.get(email=email)
                
                # Prepare the response data
                user_data = {
                    "name": user.name,
                    "email": user.email,
                    "is_admin": user.is_admin
                }
                
                return Response(data=user_data, status=200)
            except UserData.DoesNotExist:
                return Response(data={"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(data={"error": "Email parameter is missing"}, status=status.HTTP_400_BAD_REQUEST)


class AllUsers(APIView):
    def get(self, request):
        users = UserData.objects.all()
        return Response(data={"users" : [UserSerializer(user).data for user in users]}, status=status.HTTP_200_OK)
    

class UpdateUser(APIView):
    def put(self, request):
        email = request.data.get('email')
        user = UserData.objects.get(email=email)
        user.name = request.data.get('name')
        user.email = request.data.get('email')
        user.address = request.data.get('address')
        user.phone = request.data.get('phone')
        user.save()
        
        users = UserData.objects.all()
        users_data = [UserSerializer(user).data for user in users if user.type == 'normal']
        return Response(data={"users": users_data}, status=status.HTTP_200_OK)
    

class TeamsView(APIView):
    permission_classes = [IsAuthenticated]

    # LIST TEAMS FOR CURRENT USER
    def get(self, request):
        teams = Team.objects.prefetch_related('owner', 'members').filter(
            Q(members=request.user) | Q(owner=request.user)
        ).distinct()
        
        teams_data = []
        for team in teams:
            team_data = TeamsSerializer(team).data
            team_data['members_count'] = team.members.count()

            # Show first owner’s name
            owners = team.owner.all()
            team_data['owner'] = (
                UserSerializer(owners.first()).data["name"] if owners.exists() else None
            )
            teams_data.append(team_data)

            team_data['members'] = [{
                'id': member.id,
                'name': member.name,
                'tasks': [TaskSerializer(task).data for task in member.tasks.all()]
            } for member in team.members.all()]

        return Response({"teams": teams_data}, status=status.HTTP_200_OK)

    # CREATE A NEW TEAM
    def post(self, request):
        if request.user.type != 'manager':
            raise PermissionDenied("Only managers can create a team.")

        owner_id = request.user.id
        # Add the current user as the owner
        request.data['owner'] = [owner_id]

        serializer = TeamsSerializer(data=request.data)
        if serializer.is_valid():
            team = serializer.save()

            # Build response
            response_data = TeamsSerializer(team).data
            response_data['members_count'] = team.members.count()
            if team.owner.exists():
                response_data['owner'] = UserSerializer(team.owner.first()).data["name"]
            else:
                response_data['owner'] = None

            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        # Check if the user is a manager
        if request.user.type != 'manager':
            raise PermissionDenied("Only managers can update a team.")

        # Update the team if authorized
        team_id = request.data.get('id')
        try:
            team = Team.objects.get(id=team_id)
        except Team.DoesNotExist:
            return Response({"error": "Team not found"}, status=status.HTTP_404_NOT_FOUND)

        team.name = request.data.get('name', team.name)
        team.description = request.data.get('description', team.description)
        team.members.set(request.data.get('members', team.members.all()))
        team.save()

        teams = Team.objects.all()
        teams_data = [TeamsSerializer(team).data for team in teams]
        return Response(data={"teams": teams_data}, status=status.HTTP_200_OK)

    def delete(self, request):
        # Check if the user is a manager
        if request.user.type != 'manager':
            raise PermissionDenied("Only managers can delete a team.")

        # Delete the team if authorized
        team_id = request.data.get('id')
        try:
            team = Team.objects.get(id=team_id)
        except Team.DoesNotExist:
            return Response({"error": "Team not found"}, status=status.HTTP_404_NOT_FOUND)

        team.delete()

        teams = Team.objects.all()
        teams_data = [TeamsSerializer(team).data for team in teams]
        return Response(data={"teams": teams_data}, status=status.HTTP_200_OK)

class GetUserColleagues(APIView):
     permission_classes = [IsAuthenticated]
     def get(self, request):
        # 1) Find all teams where this user is either a member or an owner
        user_teams = Team.objects.filter(
            Q(members=request.user) | Q(owner=request.user)
        ).distinct()

        # 2) From those teams, find all unique users (members or owners)
        #    Exclude the current user if you don't want them in the list
        colleagues = UserData.objects.filter(
            Q(teams__in=user_teams) | Q(teams_owner__in=user_teams)
        ).distinct().exclude(id=request.user.id)

        # 3) Build the response array, matching the frontend's mock format
        #    "2025-01-04 21:14:06.465067"
        response_data = []
        for colleague in colleagues:
            response_data.append({
                "id": colleague.id,
                "name": colleague.name,
                "date_joined": colleague.date_joined.strftime("%Y-%m-%d %H:%M:%S.%f"),
                "email": colleague.email,
                "profile_picture": colleague.profile_picture,
            })

        return Response(response_data, status=status.HTTP_200_OK)


class GetTeamInfo(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        team_id = request.GET.get('team_id')
        if team_id:
            try:
                # Retrieve team data based on the provided team_id
                team = Team.objects.get(id=team_id)
                
                # Prepare the response data
                team_data = {
                    "name": team.name,
                    "description": team.description,
                    "members": [member.name for member in team.members.all()],
                    "owner": team.owner.first().name
                }
                
                return Response(data=team_data, status=200)
            except Team.DoesNotExist:
                return Response(data={"error": "Team not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(data={"error": "Team ID parameter is missing"}, status=status.HTTP_400_BAD_REQUEST)
        

class TeamDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """
        Retrieve a single team by its ID.
        Only return if the user is in members or owner.
        """
        try:
            team = Team.objects.prefetch_related('owner', 'members').get(pk=pk)
        except Team.DoesNotExist:
            return Response({"detail": "Team not found"}, status=status.HTTP_404_NOT_FOUND)

        # Verify the request.user is part of this team, or maybe the user is manager?
        if request.user not in team.members.all() and request.user not in team.owner.all():
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        team_data = TeamsSerializer(team).data
        team_data['members_count'] = team.members.count()

        owners = team.owner.all()
        team_data['owner'] = (
            UserSerializer(owners.first()).data["name"] if owners.exists() else None
        )

        team_data['members'] = [{
            'id': member.id,
            'name': member.name,
            'tasks': [TaskSerializer(task).data for task in member.tasks.all()]
        } for member in team.members.all()]

        return Response(team_data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        """
        Update a single team. Only manager can update (in your example logic).
        """
        if request.user.type != 'manager':
            raise PermissionDenied("Only managers can update a team.")

        try:
            team = Team.objects.get(pk=pk)
        except Team.DoesNotExist:
            return Response({"detail": "Team not found"}, status=status.HTTP_404_NOT_FOUND)

        team.name = request.data.get('name', team.name)
        team.description = request.data.get('description', team.description)

        # Reassign members if provided
        if 'members' in request.data:
            team.members.set(request.data['members'])

        team.save()

        # Return updated data
        serializer = TeamsSerializer(team)
        team_data = serializer.data
        team_data['members_count'] = team.members.count()
        owners = team.owner.all()
        team_data['owner'] = (
            UserSerializer(owners.first()).data["name"] if owners.exists() else None
        )

        return Response(team_data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        """
        Delete a single team. Only manager can delete (in your example logic).
        """
        if request.user.type != 'manager':
            raise PermissionDenied("Only managers can delete a team.")

        try:
            team = Team.objects.get(pk=pk)
        except Team.DoesNotExist:
            return Response({"detail": "Team not found"}, status=status.HTTP_404_NOT_FOUND)

        team.delete()
        return Response({"detail": "Team deleted successfully"}, status=status.HTTP_200_OK)


class CloudinaryFileUploadView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = FileUploadSerializer(data=request.data)
        if serializer.is_valid():
            file = serializer.validated_data['file']

            try:
                # Upload file to Cloudinary
                result = cloudinary.uploader.upload(file, folder="uploads/")  # Optional: add folder
                image_url = result['url']  # The uploaded image URL

                # Update profile pic URL in the user model
                user = request.user
                user.profile_picture = image_url
                user.save()

                return Response({"url": image_url}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class PaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Get team ID from the request data
        team_id = request.data.get('team_id')

        # Get list of user IDs (recipients) from the request data
        recipient_ids = request.data.get('user_ids', [])
        if not isinstance(recipient_ids, list):
            return Response({"error": "user_ids must be a list."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Get other fields
        amount = request.data.get('amount')
        year = datetime.now().year
        month = datetime.now().month
        details = request.data.get('details')

        # Retrieve the team
        try:
            recipient_team = Team.objects.get(id=team_id)
        except Team.DoesNotExist:
            return Response({"error": f"Team with id {team_id} does not exist."},
                            status=status.HTTP_404_NOT_FOUND)

        # Create a payment record
        payment = Payment.objects.create(
            details=details,
            amount=amount,
            month=MONTHS[month - 1],
            year=year,
        )

        # Add all recipients
        for r_id in recipient_ids:
            try:
                recipient = UserData.objects.get(id=r_id)
                payment.recipient.add(recipient)
            except UserData.DoesNotExist:
                return Response({"error": f"UserData with id {r_id} does not exist."},
                                status=status.HTTP_404_NOT_FOUND)

        # Add the team
        payment.team.add(recipient_team)

        payment.save()

        return Response({"message": "Payment succeeded"}, status=status.HTTP_200_OK)
    
    def get(self, request):
        # Retrieve all payments
        payments = Payment.objects.all()

        # Serialize the payment data
        serializer = PaymentSerializer(payments, many=True)

        all_data = serializer.data

        for data in all_data:
            data['recipient'] = [UserData.objects.get(id=recipient_id).name for recipient_id in data['recipient']]
            data['team'] = [Team.objects.get(id=team_id).name for team_id in data['team']]

        return Response({
            "payments": all_data
        }, status=status.HTTP_200_OK)
    

class TasksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        """
        If pk is provided, return the details of a single task.
        Otherwise, return a list of all tasks.
        """
        if pk:
            try:
                task = Task.objects.get(pk=pk)
            except Task.DoesNotExist:
                return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = TaskSerializer(task)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            tasks = Task.objects.all()
            serializer = TaskSerializer(tasks, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Create a new task.
        """
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        """
        Update an existing task. The task's pk must be provided.
        """
        if not pk:
            return Response({'error': 'Task id is required for update.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            task = Task.objects.get(pk=pk)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        """
        Delete an existing task. The task's pk must be provided.
        """
        if not pk:
            return Response({'error': 'Task id is required for deletion.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            task = Task.objects.get(pk=pk)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
