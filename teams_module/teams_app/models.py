from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from rest_framework import serializers
import datetime

# Create your models here.
class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    department = models.CharField(max_length=100, default="no department")
    members = models.ManyToManyField('UserData', related_name='teams', default=None)
    date_created = models.DateTimeField(default=datetime.datetime.now())
    date_last_modified = models.DateTimeField(default=datetime.datetime.now())

class UserManager(BaseUserManager):
    use_in_migration = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is Required')
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff = True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser = True')

        return self.create_user(email, password, **extra_fields)

class UserData(AbstractUser):
    username = None
    name = models.CharField(max_length=100, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_staff = models.BooleanField(default=False)
    type = models.CharField(max_length=100, default='normal')
    teams_owner = models.ManyToManyField(Team, related_name='owner')
    profile_picture = models.CharField(max_length=300, default='https://static.vecteezy.com/system/resources/thumbnails/001/840/618/small_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg')

    from django.contrib.auth.models import Group, Permission

    groups = models.ManyToManyField(
        Group,
        verbose_name='user groups',
        blank=True,
        related_name="userdata_groups",
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_query_name="userdata",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user specific permissions',
        blank=True,
        related_name="userdata_user_permissions",
        help_text='Specific permissions for this user.',
        related_query_name="userdata",
    )

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email

class FileUploadSerializer(serializers.Serializer):
    file = serializers.ImageField()  # Accepts image files only