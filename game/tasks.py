from celery import shared_task
import words

@shared_task
def update_word():
    with open('word.txt', 'w') as f:
        f.write(words.get_random())