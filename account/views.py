from datetime import date
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from .models import User, Word
from django.contrib import messages

from django.contrib.auth import login as lg
from django.contrib.auth import logout as lo
from django.contrib.auth import authenticate as auth
from django.db.models import QuerySet

from django.core.mail import send_mail
from game.words import get_random
import re, random, string

def profile(r):
    if not r.user.is_authenticated:
        return redirect('login')
    
    words: QuerySet = r.user.words.all()
    found_words = [word for word in words if word.found]
    word = Word.objects.filter(user=r.user, date=date.today()).first()

    sorted_date = words.order_by('date')
    # sorted_length = words.order_by('length')
    sorted_wrongattempts = words.order_by('wrong_attempts')
    print(sorted_wrongattempts)
    sorted_profit = words.order_by('?')
    table = [sorted_date, sorted_wrongattempts, sorted_profit]


    data = {
        "word": word,
        "found_words": found_words,
        "table": table
    }



    return render(r, 'account/profile.html', data)


def user(r, username):
    return HttpResponse('In development')


def register(r):
    if r.user.is_authenticated:
        return redirect('profile')

    if r.headers.get('x-requested-with') == 'XMLHttpRequest':
        otp = r.POST.get('otp')
        for_ = r.POST.get('requestedfor')

        if for_ == 'registration':
            # This is a registration request
            email = r.POST['email']
            otp = generate_otp()
            send_mail(
                'Word Hunter game e-mail address verification',
                f'Your verification code for Word Hunter game is {otp}\n\nIf you haven\'t requested for one, simply ignore the message.',
                'ravshanovhusniddin.2006@gmail.com',
                [email],
                fail_silently=False,
            )
            r.session['otp'] = otp
            return JsonResponse({'status': 'sent'})
        elif for_ == 'verification':
            # This is an OTP verification request
            print(otp)
            print(r.session['otp'])
            print(otp == r.session['otp'])
            if otp == r.session['otp']:
                del r.session['otp']
                return JsonResponse({'status': 'verified'})
            else:
                return JsonResponse({'status': 'Incorrect code'}, status=400)
        elif for_ == 'availibility':
            username = r.POST.get('username')
            email = r.POST['email']
            user_username = User.objects.filter(username=username)
            user_email = User.objects.filter(email=email)
            if user_username.exists():
                return JsonResponse({'status':'Username is taken'}, status=400)
            if user_email.exists():
                return JsonResponse({'status':'E-mail is already in use'}, status=400)
            else:
                return JsonResponse({'status':'username available'})

    if r.method == 'POST':
        # Get the data from the form
        username = r.POST.get('username')
        email = r.POST.get('email')
        password = r.POST.get('password')
        password_conf = r.POST.get('password-conf')

        # Clear the previous session data
        # data = r.session.pop('data', {})

        if is_valid_username(username)[0] == False or not is_valid_email(email) and is_valid_password(password)[0] == False or password!=password_conf or password == username:
            messages.info(r, 'Error occured, try again later')
            return redirect('/user/register')



        user = User.objects.create(username=username, email=email)
        user.set_password(password)
        user.save()
        word = Word.objects.create(user=user, text=get_random())
        lg(r, user)


        return redirect('/')
    
    return render(r, 'account/register.html')


def login(r):

    if r.user.is_authenticated:
        return redirect('profile')

    if r.method == "POST":
        username = r.POST['username']
        password = r.POST['password']

        data = r.session.pop('data', {})

        user = auth(username=username, password=password)

        if user == None:
            messages.info(r, "Username or password is incorrect")

            r.session['data'] = {'username': username}
            r.session.save()

            return redirect('login')
        
        else:
            lg(r, user)
            return redirect('/')

    else: 
        form_data = r.session.pop('data', None)
        context = {'data': form_data}
        return render(r, 'account/login.html', context)

def logout(r):

    if not r.user.is_authenticated:
        return redirect('login')

    lo(r)
    return redirect('/')

def change(r):

    if not r.user.is_authenticated:
        return redirect('login')

    if r.method == 'POST':
        user = r.user
        data = r.POST

        session_data = r.session.pop('data', {})

        username = data.get('username')
        email = data.get('email')
        password = data.get('oldpsw')
        newPassword = data.get('newpsw')
        newPasswordConf = data.get('newpswconf')

        # Username validation
        if username and username!=user.username:
            if is_valid_username(username)[0] == False:
                messages.info(r, is_valid_username(username)[1])

                r.session['data'] = {'username': username, 'email': email}
                r.session.save()

                return redirect('change')

            else:
                user.username = username
                user.save()


        # E-mail validation
        if email and email!=user.email:
            if is_valid_email(email):
                user.email = email
                user.save()
            else:
                messages.info(r, "Invalid e-mail")

                r.session['data'] = {'username': username, 'email': email}
                r.session.save()

                return redirect('change')

        # Password validation
        if password:
            user_obj = auth(username=user.username, password=password)
            
            if user_obj==None:
                messages.info(r, "Incorrect password")

                r.session['data'] = {'username': username, 'email': email}
                r.session.save()

                return redirect('change')
            
            elif is_valid_password(newPassword)[0] == False:
                messages.info(r, is_valid_password(newPassword)[1])

                r.session['data'] = {'username': username}
                r.session.save()

                return redirect('change')
            
            elif newPassword!=newPasswordConf:
                messages.info(r, "New passwords do not match")

                r.session['data'] = {'username': username}
                r.session.save()

                return redirect('change')
            
            elif password==newPassword:
                messages.info(r, "New passwords cannot be the same with the old password")

                r.session['data'] = {'username': username, 'email': email}
                r.session.save()

                return redirect('change')     
            
            elif newPassword == username or newPassword == user.username:
                messages.info(r, "Password should not be the same with username")

                r.session['data'] = {'username': username, 'email': email}
                r.session.save()

                return redirect('change')

            else:
                user.set_password(newPassword)
                lg(r, user)


        



        return redirect('profile')
    
def delete(r):

    if not r.user.is_authenticated:
        return redirect('login')

    user = User.objects.get(username=r.user.username)
    user.delete()


    return redirect('/')


# Validity functions
def is_valid_username(u):
    regex = r'^[a-zA-Z][a-zA-Z0-9._]*$'

    if User.objects.filter(username=u).exists(): return (False, 'Username is taken')
    elif 3 > len(u) > 21: return (False, 'Username must be between 4-20 letters')
    elif not bool(re.search(regex, u)): return (False, 'Invalid username: must start with a letter, can contain numbers and "_", "."')
    
    return (True, None)

def is_valid_email(e):
    if User.objects.filter(email=e).exists(): return (False, 'E-mail is taken')
    regex = r'^([a-z0-9_.-]+)@([\\da-z.-]+)\.([a-z.]{2,6})$'
    return bool(re.search(regex, e))


def is_valid_password(p):
    if 6 > len(p): return (False, "Password must be at least 6 characters")

    elif not any(char.isnumeric() for char in p): return (False, "Password must contain numbers")

    elif p.isdigit(): return (False, "Password must contain letters")

    return (True, None)

# ADDITIONAL
def generate_otp():
    return ''.join(random.choice(string.digits) for _ in range(6))