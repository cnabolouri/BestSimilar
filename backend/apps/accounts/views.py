from django.contrib.auth import login, logout
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.authentication import CsrfExemptSessionAuthentication
from apps.accounts.serializers import LoginSerializer, SignupSerializer, UserSerializer


class MeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class SignupAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        login(request, user)

        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class LoginAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        login(request, user)

        return Response(UserSerializer(user).data)


class LogoutAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"detail": "Logged out."})