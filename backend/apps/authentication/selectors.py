from django.contrib.auth import get_user_model

User = get_user_model()


def get_user_by_email(email: str):

    """

    Retrieve a user by email.

    Returns:
        User | None
    
    """
    try:
        return User.objects.get(email=email.lower())
    except User.DoesNotExist:
        return None