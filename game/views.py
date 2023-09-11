from django.shortcuts import render, HttpResponse
from datetime import date

# Create your views here.
def index(r):

    if not r.user.is_authenticated:
        return render(r, 'game.html')
    word = r.user.word_set.filter(date=date.today())
    data = {
        "word": word[0]
    }
    return render(r, 'game.html', data)