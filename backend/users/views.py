from datetime import timedelta

from django.conf import settings
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.timezone import now
from users.models import CustomUser
from users.serializers import RegisterUserSerializer


# Create your views here.
class RegisterView(CreateAPIView):
    serializer_class = RegisterUserSerializer
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            email_errors = serializer.errors.get('email', [])
            if any("already exists" in str(e).lower() for e in email_errors):
                return Response({'error': 'Profile with that email already exists'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': 'Error while parsing data'}, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        access_exp = now() + timedelta(minutes=60)
        refresh_exp = now() + timedelta(days=7)

        response = Response({
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role
            }
        }, status=status.HTTP_201_CREATED)

        # Access Token cookie
        response.set_cookie(
            key='access_token',
            value=str(access_token),
            expires=access_exp,
            httponly=True,
            secure=not settings.DEBUG,
            samesite='Lax'
        )

        # Refresh Token cookie
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            expires=refresh_exp,
            httponly=True,
            secure=not settings.DEBUG,
            samesite='Lax'
        )

        return response


class LoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = TokenObtainPairSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        refresh = serializer.validated_data["refresh"]
        access = serializer.validated_data["access"]

        # Получаваме потребителя (от Token serializer-а)
        user = CustomUser.objects.get(email=request.data["email"])

        access_exp = now() + timedelta(minutes=60)
        refresh_exp = now() + timedelta(days=7)

        response = Response({
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role
            }
        }, status=status.HTTP_200_OK)

        response.set_cookie(
            key='access_token',
            value=str(access),
            expires=access_exp,
            httponly=True,
            secure=not request.get_host().startswith("localhost"),
            samesite="Lax"
        )

        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            expires=refresh_exp,
            httponly=True,
            secure=not request.get_host().startswith("localhost"),
            samesite="Lax"
        )

        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh_token")
            if not refresh_token:
                return Response({"error": "No refresh token found in cookies"}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()

            response = Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)

            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")

            return response

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RefreshAccessTokenView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response({"error": "Refresh token not found in cookies"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(refresh_token)
            new_access = refresh.access_token
            access_exp = now() + timedelta(minutes=60)

            response = Response({"message": "Access token refreshed"}, status=status.HTTP_200_OK)
            response.set_cookie(
                key='access_token',
                value=str(new_access),
                expires=access_exp,
                httponly=True,
                secure=not request.get_host().startswith("localhost"),
                samesite="Lax"
            )
            return response
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
        })
