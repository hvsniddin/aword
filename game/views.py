from django.shortcuts import render, HttpResponse
from datetime import date

from account.models import Word
from .words import get_random

# Create your views here.
def index(r):

    if not r.user.is_authenticated:
        return render(r, 'game/game.html')
    
    data = {}

    try:
        word = r.user.words.get(date=date.today())
    except Word.DoesNotExist:
        word = Word.objects.create(user=r.user, text=get_random())
        
    data['word'] = word
        

    return render(r, 'game/game.html', data)