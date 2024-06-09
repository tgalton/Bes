from rest_framework import viewsets, status
from .models import HouseScore, UserProfile
from .serializers import HouseScoreSerializer, UserSerializer, UserProfileSerializer
from django.contrib.auth.models import User
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers




# VueSet pour gérer les UserProfiles
class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['patch'])
    def update_avatar(self, request, pk=None):
        profile = self.get_object()
        avatar = request.data.get('avatar')
        if avatar:
            profile.avatar = avatar
            profile.save()
            return Response({'status': 'avatar updated'})
        else:
            return Response({'error': 'No avatar provided'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def get_avatars(self, request):
        user_ids = request.data.get('user_ids', [])
        profiles = UserProfile.objects.filter(user_id__in=user_ids)
        response_data = [{'id': profile.user_id, 'name': profile.user.username, 'avatar': profile.avatar if profile.avatar else 'Pas d\'avatar'} for profile in profiles]
        return Response(response_data)

# VueSet pour gérer les HouseScores
class HouseScoreViewSet(viewsets.ModelViewSet):
    queryset = HouseScore.objects.all()
    serializer_class = HouseScoreSerializer
    permission_classes = [permissions.IsAuthenticated]

# Vue pour créer un utilisateur
class UserCreateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({'id': user.id, 'username': user.username, 'email': user.email, 'refresh': str(refresh), 'access': str(refresh.access_token)}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.EMAIL_FIELD

    def validate(self, attrs):
        email = attrs.get("email", "")
        password = attrs.get("password", "")
        
        user = User.objects.filter(email=email).first()
        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user_id": user.id,
            }
        else:
            raise serializers.ValidationError("Invalid email or password")

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer