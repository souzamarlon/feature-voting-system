from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import UserProfile


def serialize_user(user):
    profile = UserProfile.get_for_user(user)
    return {
        "id": user.id,
        "username": user.username,
        "role": profile.role,
    }


@api_view(["POST"])
def login_view(request):
    username = request.data.get("username", "")
    password = request.data.get("password", "")
    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {"detail": "Invalid username or password."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key, "user": serialize_user(user)})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_view(request):
    return Response({"user": serialize_user(request.user)})
