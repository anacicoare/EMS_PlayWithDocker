from datetime import datetime
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from payments_app.serializers import PaymentSerializer
from payments_app.models import Payment
from teams_app.models import UserData, Team

MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']


# Create your views here.

class PaymentView(APIView):
    # permission_classes = [IsAuthenticated]

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
    
from prometheus_client import CollectorRegistry, generate_latest, CONTENT_TYPE_LATEST, multiprocess
from django.http import HttpResponse
class MetricsView(APIView):
    def get(self, request):
        registry = CollectorRegistry()
        multiprocess.MultiProcessCollector(registry)
        data = generate_latest(registry)
        return HttpResponse(data, content_type=CONTENT_TYPE_LATEST)