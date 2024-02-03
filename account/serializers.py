from datetime import date

from rest_framework.serializers import ModelSerializer, SerializerMethodField

from django.contrib.auth import get_user_model
from django.db.models import Q

from .models import Word

User = get_user_model()

class WordSerializer(ModelSerializer):
    class Meta:
        model = Word
        fields = ['id', 'text', 'date', 'correct_attempts', 'wrong_attempts', 'bought', 'found', 'started', 'profit']

class UserSerializer(ModelSerializer):
    words = SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'timezone', 'balance', 'words']

    def get_words(self, obj):
        words = Word.objects.filter(user=obj).order_by('-date')
        words = [word for word in words if word.date < date.today() or word.found]
        return WordSerializer(words, many=True).data