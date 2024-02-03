from django.contrib.auth import forms, get_user_model

User = get_user_model()

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

class ChangeProfileForm(forms.UserChangeForm):
    class Meta:
        model = User
        fields = ['username', 'email']
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
