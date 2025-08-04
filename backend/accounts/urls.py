from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

from .serializers import LoginSerializer
from .views import RegisterView, ProtectedView


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer


urlpatterns = [
    path('register', RegisterView.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'),
    path('refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected', ProtectedView.as_view(), name='protected'),
]
