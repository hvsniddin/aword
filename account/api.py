import random
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken

from .models import User

from .forms import SignupForm

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def signup(r):
    data = r.data
    print(data)
    form = SignupForm(data)
    if form.is_valid():
        user = form.save()
         
        # TODO: e-mail verification 
    else:
        return Response({'error': form.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    refresh = RefreshToken.for_user(user)

    return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }, status=status.HTTP_201_CREATED)

@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def request_otp(r):
    email = r.data.get('email')

    otp = [str(random.randint(0,9)) for i in range(6)]
    # print(otp)
    error = None

    if not otp:
        error="Something went wrong"
        return Response({'error':error}, status=status.HTTP_400_BAD_REQUEST)

    # TODO: send otp
    return Response({'ok':True})

@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def verify_otp(r):
    otp = r.data.get('otp')
    # print(otp)
    if not otp:
        return Response({'error':'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)

    verify = [int(i)==int(j) for i, j in zip(otp, ['1','1','1','1','1','1'])]
    # print(False not in verify)
    return Response({'ok':(False not in verify)})


@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def check_availibility(r):
    username = r.data.get('username')
    email = r.data.get('email')
    available = True

    if username:
        available = not User.objects.filter(username=username).exists()
    if email:
        available = not User.objects.filter(email=email).exists()

    return Response({'ok':available})