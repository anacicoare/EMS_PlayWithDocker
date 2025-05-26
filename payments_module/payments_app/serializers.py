from rest_framework import serializers

from payments_app.models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    recipient = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    team = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Payment
        fields = ["id", "details", "amount", "month", "year", "recipient", "team"]