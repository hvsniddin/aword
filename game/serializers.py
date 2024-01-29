from rest_framework import serializers

from account.models import User, Word

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'balance', 'is_finished', 'pfp']

class WordSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    found = serializers.ReadOnlyField(source='found')
    class Meta:
        model = Word
        fields = ['__all__']