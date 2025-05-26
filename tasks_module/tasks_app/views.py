from datetime import datetime
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from tasks_app.serializers import TaskSerializer
from tasks_app.models import Task

class TasksView(APIView):

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
