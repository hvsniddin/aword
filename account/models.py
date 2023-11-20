from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField

from datetime import date
from uuid import uuid4
from .fields import CaseInsensitiveCharField

import pytz


# Create your models here.
class User(AbstractUser):
    # General
    first_name = None
    last_name = None
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    username = CaseInsensitiveCharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)
    timezone = models.CharField(max_length=50, choices=[(tz, tz) for tz in pytz.all_timezones], default="UTC")
    pfp = models.ImageField(upload_to='pics/pfp', default='placeholder.png')
    balance = models.IntegerField(default=0)
    is_finished = models.BooleanField(default=False)

    # Privacy
    show_profile = models.BooleanField(default=True)
    show_stats = models.BooleanField(default=True)
    show_balance = models.BooleanField(default=True)

    # Game
    notifications = models.BooleanField(default=True)
    ads = models.BooleanField(default=True)


class Word(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='words')
    text = models.CharField(max_length=15)
    date = models.DateField(default=date.today)

    letters = ArrayField(models.CharField(max_length=1), default=list)
    wrong_attempts = ArrayField(models.CharField(max_length=1), default=list)

    @property
    def found(self):
        for i in self.text:
            if i not in self.letters:
                return False
        return True
    

    def save(self, *args, **kwargs):
        if '-' in self.text and '-' not in self.letters:
            self.letters.append('-')
        super().save(*args, **kwargs)