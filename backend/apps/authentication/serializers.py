from rest_framework import serializers

from .models import User
from .services import login_user,logout_user,register_user


class RegistrationSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User

        fields = (
            "email",
            "username",
            "password",
            "confirm_password",
        )

    def validate_email(self, value):

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Email already exists."
            )

        return value.lower()

    def validate(self, attrs):

        if attrs["password"] != attrs["confirm_password"]:

            raise serializers.ValidationError(
                {
                    "confirm_password":
                    "Passwords do not match."
                }
            )

        return attrs

    def create(self, validated_data):

        validated_data.pop("confirm_password")

        return register_user(
            email=validated_data["email"],
            username=validated_data.get("username"),
            password=validated_data["password"],
            
        )

class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True
    )

    def validate(self, attrs):

        self.user_data = login_user(
            email=attrs["email"],
            password=attrs["password"],
        )

        return attrs

class UserSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "username",
            "is_verified",
            "roles",
        )

    def get_roles(self, obj):
        return [
            user_role.role.name
            for user_role in obj.user_roles.filter(is_active=True)
        ]

class LoginResponseSerializer(serializers.Serializer):

    user = UserSerializer()
    access = serializers.CharField()
    refresh = serializers.CharField()


class LogoutSerializer(serializers.Serializer):

    refresh = serializers.CharField()

    def save(self):

        logout_user(
            refresh_token=self.validated_data["refresh"]
        )
    
