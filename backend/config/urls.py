from django.contrib import admin
from django.urls import path
from main import views
from accounts import views as auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('api/register/', auth_views.register, name='register'),
    path('api/login/', auth_views.login, name='login'),
    path('api/token/refresh/', auth_views.refresh_token, name='token_refresh'),
    path('api/protected/', auth_views.protected, name='protected'),
]
