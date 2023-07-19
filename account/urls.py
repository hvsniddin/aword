from django.urls import path
from .views import profile, register, login, logout, change, delete

urlpatterns = [
    path('', profile, name='profile'),
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('change/', change, name='change-profile'),
    path('delete/', delete, name='delete'),
]