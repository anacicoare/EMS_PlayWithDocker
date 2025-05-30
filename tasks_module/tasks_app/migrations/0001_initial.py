# Generated by Django 5.0.14 on 2025-05-12 20:59

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('summary', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('date_created', models.DateTimeField(default=datetime.datetime(2025, 5, 12, 23, 59, 39, 247062))),
                ('start_date', models.DateTimeField(default=datetime.datetime(2025, 5, 12, 23, 59, 39, 247078))),
                ('end_date', models.DateTimeField(default=datetime.datetime(2025, 5, 12, 23, 59, 39, 247098))),
                ('estimation', models.FloatField()),
                ('type', models.CharField(default='NEW FEATURE', max_length=100)),
                ('status', models.CharField(default='TO DO', max_length=100)),
                ('original_estimate', models.FloatField(default=30)),
            ],
        ),
    ]
