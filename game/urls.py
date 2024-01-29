from django.urls import path

from .api import GameAPIView
from .views import index

urlpatterns = [
    path('', GameAPIView.as_view()),
]