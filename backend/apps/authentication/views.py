from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from .serializers import RegistrationSerializer,LoginResponseSerializer,LogoutSerializer,UserSerializer
from rest_framework.permissions import IsAuthenticated


from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import LoginSerializer

class RegisterView(CreateAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [AllowAny]

class LoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = LoginSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        # return Response(
        #     serializer.user_data,
        #     status=status.HTTP_200_OK,
        # )
        response_serializer = LoginResponseSerializer(
            serializer.user_data
        )
        return Response(
            response_serializer.data,
            status=status.HTTP_200_OK,
        )

class LogoutView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = LogoutSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            {
                "detail": "Successfully logged out."
            },
            status=status.HTTP_200_OK,
        )     

class MeView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        serializer = UserSerializer(
            request.user
        )

        return Response(
            serializer.data
        )
    
