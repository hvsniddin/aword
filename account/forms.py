from django.contrib.auth import forms

from .models import User

class SignupForm(forms.UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']
        error_messages = {
            'username': {
                'unique': "Username is taken",
                'required': "Username is required"
            },
            'email': {
                'unique': "E-mail is already in use",
                'required': "E-mail is required"
            }
        }