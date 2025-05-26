from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from proj_backend.models import UserData, Team, Payment, Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['name'] = user.name
        token['email'] = user.email
        token['type'] = user.type
        # ...

        return token

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = UserData
        fields = ["id", "email", "name", "password", "type", "date_joined", "profile_picture"]

    def create(self, validated_data):
        print(validated_data)
        validated_data['password'] = make_password(validated_data['password'])
        return super(UserSerializer, self).create(validated_data)
    
class TeamsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ["id", "name", "description", "members", "date_created", "date_last_modified", "department", "owner"]

class FileUploadSerializer(serializers.Serializer):
    file = serializers.ImageField()  # Accepts image files only

class PaymentSerializer(serializers.ModelSerializer):
    recipient = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    team = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Payment
        fields = ["id", "details", "amount", "month", "year", "recipient", "team"]