from rest_framework import serializers


class FileUploadSerializer(serializers.Serializer):
    file = serializers.ImageField()  # Accepts image files only