from django.urls import path
from .views import profile, register, login, logout, change, delete

urlpatterns = [
    path('', profile, name='profile'),
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('change/', change, name='password_change'),
    path('delete/', delete, name='delete'),
    # path('<str:username>', user, name='user'),
]