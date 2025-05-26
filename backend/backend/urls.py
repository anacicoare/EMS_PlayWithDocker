"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from proj_backend import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/register/", views.RegisterView.as_view(), name="register"),
    path('api/test/', views.Test.as_view(), name='test'),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/profile/', views.ProfileView.as_view(), name='profile'),
    path('api/teams/', views.TeamsView.as_view(), name='teams'),
    path('api/teams/<int:pk>/', views.TeamDetailView.as_view(), name='team-detail'),
    path('api/get_user_colleagues/', views.GetUserColleagues.as_view(), name='get_user_colleagues'),
    path('api/all_users/', views.AllUsers.as_view(), name='all_users'),
    path('api/upload_profile_pic/', views.CloudinaryFileUploadView.as_view(), name='file-upload'),  # Upload endpoint
    path('api/payments/', views.PaymentView.as_view(), name='payment'),
    path('api/tasks/', views.TasksView.as_view(), name='tasks_list_create'),
    path('api/tasks/<int:pk>/', views.TasksView.as_view(), name='task_detail'),
]

