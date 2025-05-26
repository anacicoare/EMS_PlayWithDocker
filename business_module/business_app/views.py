from datetime import datetime
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.exceptions import PermissionDenied
from business_app.serializers import FileUploadSerializer
import cloudinary.uploader  # Cloudinary uploader for API-based uploads
from teams_app.models import UserData, Team

cloudinary.config(
    cloud_name='dgucrlzlw',
    api_key='147227354924822',
    api_secret='3k8AMZpov1DxAz9_Zj4_JVvWj_8',
)

MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']



from django.shortcuts import render

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
        

class GetUserColleagues(APIView):
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
