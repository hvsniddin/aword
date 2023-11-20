from django.contrib import admin
from .models import User, Word

# Register your models here.
admin.site.register(User)
admin.site.register(Word)