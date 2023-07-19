import random

with open('words.txt', 'r') as f:
    text = f.read()

l = text.split()

def get_words():
    return l

def get_random():
    return random.choice(l)