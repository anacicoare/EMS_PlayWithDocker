"""
URL configuration for teams_module project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
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
from teams_app import views
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/teams/register/", views.RegisterView.as_view(), name="register"),
    path('api/teams/test/', views.Test.as_view(), name='test'),
    path('api/teams/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/teams/profile/', views.ProfileView.as_view(), name='profile'),
    path('api/teams/', views.TeamsView.as_view(), name='teams'),
    path('api/teams/<int:pk>/', views.TeamDetailView.as_view(), name='team-detail'),
    path('api/get_user_colleagues/', views.GetUserColleagues.as_view(), name='get_user_colleagues'),
    path('api/all_users/', views.AllUsers.as_view(), name='all_users'),
    path('api/upload_profile_pic/', views.CloudinaryFileUploadView.as_view(), name='file-upload'),  # Upload endpoint

]
