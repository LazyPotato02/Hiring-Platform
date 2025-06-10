from django.urls import path

from users.views import RegisterView, LogoutView, MeView, LoginView, RefreshAccessTokenView, UpdateProfileView, \
    ChangePasswordView

urlpatterns = [

    path('me/', MeView.as_view(), name='me'),

    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh-token/', RefreshAccessTokenView.as_view(), name='refresh-token'),
    path('update-profile/', UpdateProfileView.as_view(), name='update-profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
