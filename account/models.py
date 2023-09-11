from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField

from datetime import date


# Create your models here.
class Profile(AbstractUser):
    pfp = models.ImageField(upload_to='pics/pfp', default='placeholder.png')
    balance = models.IntegerField(default=0)

    is_finished = models.BooleanField(default=False)

    show_profile = models.BooleanField(default=True)
    show_stats = models.BooleanField(default=True)
    show_balance = models.BooleanField(default=True)

    notifications = models.BooleanField(default=True)
    ads = models.BooleanField(default=True)


class Word(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    text = models.CharField(max_length=15)
    date = models.DateField(default=date.today)

    letters = ArrayField(models.CharField(max_length=1), default=list)
    if '-' in str(text): letters.append('-')
    wrong_attempts = ArrayField(models.CharField(max_length=1), default=list)

    found = models.BooleanField(default=False)

    def check_finished(self):
        for i in self.text:
            if i not in self.letters:
                return False
        return True
    
