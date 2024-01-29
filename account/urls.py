from django.urls import path
# from .views import profile, register, login, logout, change, delete
from .api import signup, request_otp, verify_otp, check_availibility
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('signup/', signup),
    path('signup/requestOTP/', request_otp),
    path('signup/verifyOTP/', verify_otp),
    path('signup/checkAvailability/', check_availibility),

    path('login/', TokenObtainPairView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
]