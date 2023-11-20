from datetime import date
from django.core.management.base import BaseCommand, CommandError

from account.models import User, Word
from game.words import get_random

class Command(BaseCommand):
    help = 'Changes today\'s word of users'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username of whose word would be changed')

        parser.add_argument('--replace', action='store_true', help='Wether to replace today\'s word if exists')

        parser.add_argument('word', type=str, help='Username of whose word would be changed', nargs='?')


    def handle(self, *args, **options):
        username = options.get('username')
        replace = options.get('replace')

        user = User.objects.get(username=username)
        word = Word.objects.filter(user=user, date=date.today())

        if not replace and word:
            print(word.first().text)
            raise CommandError(f"User already has a word for today: {word.first().text}")
        
        word.delete()
        text=get_random()
        if options.get('word'):
            text=options.get('word')
        word = Word.objects.create(user=user, text=text)
        print(f"Today's word for {user} is changed to {word.text}")
