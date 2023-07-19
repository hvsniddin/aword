from django.shortcuts import render, redirect
from .models import Profile
from django.contrib import messages
from django.contrib.auth import login as lg
from django.contrib.auth import logout as lo
from django.contrib.auth import authenticate as auth

import re

# Create your views here.
def profile(r):

    if not r.user.is_authenticated:
        return redirect('login')
    
    return render(r, 'profile.html')

def register(r):

    if r.user.is_authenticated:
        return redirect('/profile')

    if r.method == 'POST':
        # Get the data from the form
        username = r.POST.get('username')
        email = r.POST.get('email')
        password = r.POST.get('password')
        password_conf = r.POST.get('password-conf')

        # Clear the previous session data
        data = r.session.pop('data', {})

        # Username validation
        if is_valid_username(username)[0] == False:
            messages.info(r, is_valid_username(username)[1])

            r.session['data'] = {'username': username, 'email': email}
            r.session.save()

            return redirect('/profile/register')


        # E-mail validation
        if not is_valid_email(email):
            messages.info(r, "Invalid e-mail")

            r.session['data'] = {'username': username, 'email': email}
            r.session.save()

            return redirect('/profile/register')

        # Password validation
        if is_valid_password(password)[0] == False:
            messages.info(r, is_valid_password(password)[1])

            r.session['data'] = {'username': username}
            r.session.save()

            return redirect('/profile/register')
        
        elif password!=password_conf:
            messages.info(r, "Passwords do not match")

            r.session['data'] = {'username': username}
            r.session.save()

            return redirect('/profile/register')     
        
        elif password == username:
            messages.info(r, "Password should not be the same with username")

            r.session['data'] = {'username': username, 'email': email}
            r.session.save()

            return redirect('/profile/register')

        user = Profile.objects.create(username=username, email=email)
        user.set_password(password)
        lg(r, user)


        return redirect('/profile/')
    else: 
        form_data = r.session.pop('data', None)
        context = {'data': form_data}
        return render(r, 'register.html', context)


def login(r):

    if r.user.is_authenticated:
        return redirect('/profile/')

    if r.method == "POST":
        username = r.POST['username']
        password = r.POST['password']

        data = r.session.pop('data', {})

        user = auth(username=username, password=password)

        if user == None:
            messages.info(r, "Username or password is incorrect")

            r.session['data'] = {'username': username}
            r.session.save()

            return redirect('/profile/login')
        
        else:
            lg(r, user)
            return redirect('/')

    else: 
        form_data = r.session.pop('data', None)
        context = {'data': form_data}
        return render(r, 'login.html', context)

def logout(r):

    if not r.user.is_authenticated:
        return redirect('/profile/login')

    lo(r)
    return redirect('/')

def change(r):

    if not r.user.is_authenticated:
        return redirect('/profile/login')

    if r.method == 'POST':
        user = r.user
        data = r.POST

        session_data = r.session.pop('data', {})

        username = data.get('username')
        email = data.get('email')
        password = data['password']
        newPassword = data.get('newPassword')
        newPasswordConf = data.get('newPasswordConf')

        # Username validation
        if username and username!=user.username:
            if is_valid_username(username)[0] == False:
                messages.info(r, is_valid_username(username)[1])

                r.session['data'] = {'username': username, 'email': email}
                r.session.save()

                return redirect('/profile/change')

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

                return redirect('/profile/change')

        # Password validation
        if password:
            user_obj = auth(username=user.username, password=password)
            
            if user_obj==None:
                messages.info(r, "Incorrect password")

                r.session['data'] = {'username': username, 'email': email}
                r.session.save()

                return redirect('/profile/change')
            
            elif is_valid_password(newPassword)[0] == False:
                messages.info(r, is_valid_password(newPassword)[1])

                r.session['data'] = {'username': username}
                r.session.save()

                return redirect('/profile/change')
            
            elif newPassword!=newPasswordConf:
                messages.info(r, "New passwords do not match")

                r.session['data'] = {'username': username}
                r.session.save()

                return redirect('/profile/change')
            
            elif password==newPassword:
                messages.info(r, "New passwords cannot be the same with the old password")

                r.session['data'] = {'username': username, 'email': email}
                r.session.save()

                return redirect('/profile/change')     
            
            elif newPassword == username or newPassword == user.username:
                messages.info(r, "Password should not be the same with username")

                r.session['data'] = {'username': username, 'email': email}
                r.session.save()

                return redirect('/profile/change')

            else:
                user.set_password(newPassword)
                lg(r, user)


        



        return redirect('/profile/')


    else: 
        form_data = r.session.pop('data', None)
        context = {'data': form_data}
        return render(r, 'change-profile.html', context)
    
def delete(r):

    if not r.user.is_authenticated:
        return redirect('/profile/login')

    user = Profile.objects.get(username=r.user.username)
    user.delete()


    return redirect('/')



# Validity functions
def is_valid_username(u):
    regex = r'^[a-zA-Z][a-zA-Z0-9._]*$'

    if Profile.objects.filter(username=u).exists(): return (False, 'Username is taken')
    elif 3 > len(u) > 21: return (False, 'Username must be between 4-20 letters')
    elif not bool(re.search(regex, u)): return (False, 'Invalid username: must start with a letter, can contain numbers and "_", "."')
    
    return (True, None)

def is_valid_email(e):
    regex = r'^([a-z0-9_.-]+)@([\\da-z.-]+)\.([a-z.]{2,6})$'
    return bool(re.search(regex, e))


def is_valid_password(p):
    if 6 > len(p): return (False, "Password must be at least 6 characters")

    elif not any(char.isnumeric() for char in p): return (False, "Password must contain numbers")

    elif p.isdigit(): return (False, "Password must contain letters")

    return (True, None)