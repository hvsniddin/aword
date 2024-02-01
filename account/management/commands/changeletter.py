from datetime import date
from django.core.management.base import BaseCommand, CommandError

from account.models import User, Word
from game.words import get_random

class Command(BaseCommand):
    help = 'Changes today\'s word of users'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username of whose word would be changed')
        parser.add_argument('letter', type=str, help='Username of whose word would be changed', nargs='?')
        parser.add_argument('--remove', action='store_true', help='Wether to replace today\'s word if exists')



    def handle(self, *args, **options):
        username = options.get('username')
        letter = options.get('letter')
        remove = options.get('remove')

                

        user = User.objects.get(username=username)
        word = Word.objects.filter(user=user, date=date.today()).first()
        letters = word.correct_attempts

        if letter and len(letter)>1:
            for i in letter:
                if i not in letters:
                    letters.append(i)
            else: print('All letters in given word added')
            word.save()
            return
        
        if not letter and remove:
            letters.clear()
            word.save()
            print('Cleared')
        elif not letter and not remove:
            raise CommandError('Enter a letter or use --remove to clear')

        elif letter in letters and not remove:
            raise CommandError(f"{letter} is already in letters")
        elif letter in letters and remove:
            letters.remove(letter)
            word.save()
            print(f"{letter} removed")
        elif letter and letter not in letters:
            letters.append(letter)
            word.save()
            print(f"{letter} added")        
