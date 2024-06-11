from venv import logger
from rest_framework import viewsets, status
from .models import HouseScore, UserProfile
from .serializers import CustomTokenObtainPairSerializer, HouseScoreSerializer, UserSerializer, UserProfileSerializer
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils.decorators import method_decorator
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import csrf_protect
from django.middleware.csrf import get_token
from django.http import Http404, JsonResponse
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.decorators import login_required
from rest_framework import generics
from django.core.exceptions import MultipleObjectsReturned


# Vue pour le jeton CSRF
@api_view(['GET'])  # Définir que la vue accepte uniquement les requêtes GET
@permission_classes([IsAuthenticated])  # Exiger que l'utilisateur soit authentifié
def csrf(request):
    """
    Vue pour retourner le jeton CSRF. L'utilisateur doit être authentifié pour y accéder.
    """
    return JsonResponse({'csrfToken': get_token(request)})

# VueSet pour gérer les UserProfiles
from django.contrib.auth.decorators import login_required
from rest_framework import generics

class UserProfileCreateView(generics.CreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# @ensure_csrf_cookie
class UserProfileUpdateView(generics.UpdateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        try:
            return self.request.user.profile
        except UserProfile.DoesNotExist:
            raise Http404("Aucun profil associé à cet utilisateur n'a été trouvé.")
        except MultipleObjectsReturned:
            # Log cette erreur pour une intervention
            logger.error(f"Multiple profiles found for user {self.request.user.id}!")
            raise Http404("Plusieurs profils trouvés pour un utilisateur unique. Contactez l'assistance.")


# VueSet pour gérer les HouseScores
class HouseScoreViewSet(viewsets.ModelViewSet):
    queryset = HouseScore.objects.all()
    serializer_class = HouseScoreSerializer
    permission_classes = [permissions.IsAuthenticated]

# Vue pour créer un utilisateur
class UserCreateView(APIView):
    permission_classes = [permissions.AllowAny]

    @csrf_exempt     
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({'id': user.id, 'username': user.username, 'email': user.email, 'refresh': str(refresh), 'access': str(refresh.access_token)}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# Vue pour récupérer l'utilisateur courant via token actuel
class CurrentUserView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    # @ensure_csrf_cookie
    @csrf_exempt     
    def get_object(self):
        """
        Override the typical get_object method to return the User object
        associated with the request.user.
        """
        return self.request.user