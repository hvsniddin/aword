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

    # Privacy
    show_profile = models.BooleanField(default=True)
    show_stats = models.BooleanField(default=True)
    show_balance = models.BooleanField(default=True)

    # Game
    notifications = models.BooleanField(default=True)
    ads = models.BooleanField(default=True)

    @property
    def getTodaysWord(self):
        word = self.words.filter(date=date.today())
        if not word:
            return None
        return word[0]
    
    @property
    def plays(self):
        return self.words.filter(started=True)
        
    
    @property
    def wins(self):
        return self.plays.filter(found=True)


    @property
    def avg_attempts(self):
        r=0
        for i in self.wors:
            if i.found:
                r+=len(i.correct_attempts)+len(i.wrong_attempts)
        return r/len(self.wins)
    
    @property
    def winrate(self):
        return round(len(self.wins)*100/len(self.plays))


class Word(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='words')
    text = models.CharField(max_length=15)
    date = models.DateField(default=date.today)

    correct_attempts = ArrayField(models.CharField(max_length=1), default=list)
    wrong_attempts = ArrayField(models.CharField(max_length=1), default=list)
    bought = ArrayField(models.CharField(max_length=1), default=list)

    @property
    def found(self):
        letters = self.correct_attempts+self.bought
        for i in self.text:
            if i not in letters:
                return False
        return True
    
    @property
    def started(self):
        return self.date is not None and bool(self.correct_attempts or self.wrong_attempts or self.bought)

    @property
    def profit(self):
        profit = 0
        for i in self.correct_attempts:
            profit += self.text.count(i)
        profit = profit+len(self.text) if self.found else profit+0
        profit -= len(self.wrong_attempts)
        profit -= len(self.bought)

        return profit

    def save(self, *args, **kwargs):
        if '-' in self.text and '-' not in self.letters:
            self.letters.append('-')
        super().save(*args, **kwargs)