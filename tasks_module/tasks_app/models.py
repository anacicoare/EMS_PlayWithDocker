import datetime
from django.db import models
from teams_app.models import UserData, Team

class Task(models.Model):
    summary = models.CharField(max_length=100)
    description = models.TextField()
    date_created = models.DateTimeField(default=datetime.datetime.now())
    start_date = models.DateTimeField(default=datetime.datetime.now())
    end_date = models.DateTimeField(default=datetime.datetime.now())
    estimation = models.FloatField()
    type = models.CharField(max_length=100, default='NEW FEATURE')
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='tasks')
    assigned_to = models.ForeignKey(UserData, on_delete=models.CASCADE, related_name='tasks')
    status = models.CharField(max_length=100, default='TO DO')
    original_estimate = models.FloatField(default=30)

