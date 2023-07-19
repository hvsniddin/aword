from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class Profile(AbstractUser):
    pfp = models.ImageField(upload_to='pics/pfp', default='placeholder.png')
    gps = models.IntegerField(default=0)
    coins = models.IntegerField(default=0)
    words = ArrayField(models.TextField(), default=list)
    letters = ArrayField(models.CharField(max_length=1), default=list)
    is_finished = models.BooleanField(default=False)
