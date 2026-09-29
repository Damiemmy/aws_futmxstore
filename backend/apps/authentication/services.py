from django.db import transaction
from .models import User, Role, UserRole
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken

from .selectors import get_user_by_email


from rest_framework_simplejwt.tokens import RefreshToken


def logout_user(*, refresh_token):
    """
    Blacklist a refresh token.
    """

    token = RefreshToken(refresh_token)

    token.blacklist()

@transaction.atomic
def register_user(*, email, password, username=None):
    """
    Business workflow for user registration.

    Responsibilities:
    - Create user
    - Assign Customer role
    - Return created user

    Future:
    - Send verification email
    """

    user = User.objects.create_user(
        email=email,
        password=password,
        username=username.lower(),
    )

    customer_role = Role.objects.get(name="Customer")

    UserRole.objects.create(
        user=user,
        role=customer_role,
        is_active=True,
        is_approved=True,
    )

    return user



def login_user(*, email, password):
    """
    Authenticate a user and generate JWT tokens.
    """

    user = get_user_by_email(email)

    if user is None:
        raise AuthenticationFailed("Invalid email or password.")

    authenticated_user = authenticate(
        email=email,
        password=password,
    )

    if authenticated_user is None:
        raise AuthenticationFailed("Invalid email or password.")

    if not authenticated_user.is_active:
        raise AuthenticationFailed("Account is inactive.")

    refresh = RefreshToken.for_user(authenticated_user)

    return {
        "user": authenticated_user,
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


def logout_user(*, refresh_token):
    """
    Blacklist a refresh token.
    """

    token = RefreshToken(refresh_token)

    token.blacklist()

