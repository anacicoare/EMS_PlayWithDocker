from django.db import models
from teams_app.models import UserData, Team

class Payment(models.Model):
    details = models.CharField(max_length=1000)
    amount = models.FloatField()
    month = models.CharField(max_length=100)
    year = models.IntegerField()
    recipient = models.ManyToManyField('teams_app.UserData', related_name='payments')
    team = models.ManyToManyField(Team, related_name='payments')
