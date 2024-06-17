from venv import logger
from rest_framework import viewsets, status


from .models import HouseScore, UserProfile, House
from .serializers import ChangePasswordSerializer, CustomTokenObtainPairSerializer, HouseScoreSerializer, UserDetailsSerializer, UserSerializer, UserProfileSerializer
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes, action
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt, csrf_protect
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User
from django.middleware.csrf import get_token
from django.http import Http404, JsonResponse
from django.core.exceptions import MultipleObjectsReturned


# Vue pour le jeton CSRF
@api_view(['GET'])  # Définir que la vue accepte uniquement les requêtes GET
@permission_classes([permissions.IsAuthenticated])  # Exiger que l'utilisateur soit authentifié
def csrf(request):
    """
    Vue pour retourner le jeton CSRF. L'utilisateur doit être authentifié pour y accéder.
    """
    return JsonResponse({'csrfToken': get_token(request)})

# CreateView pour créer les UserProfiles
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
class UserCreateView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserDetailsSerializer

    @csrf_exempt     
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({'id': user.id, 'username': user.username, 'email': user.email, 'refresh': str(refresh), 'access': str(refresh.access_token)}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserProfileDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserDetailsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filtrer les utilisateurs selon la relation House pour s'assurer de retourner les utilisateurs partageant le même 'house' que le requérant
        users_in_common_houses = User.objects.filter(house__in=self.request.user.house_set.all()).distinct()
        return users_in_common_houses
    
# Vu pour changer tout pour parti de son propre profil(password, username, email)
class UserUpdateView(generics.UpdateAPIView):  
    permission_classes = [permissions.IsAuthenticated] 
    serializer_class = UserDetailsSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True  # Set partial to True to allow partial updates
        return super().update(request, *args, **kwargs)

    def perform_update(self, serializer):
        serializer.save()

    def get_serializer_class(self):
        # Switch serializer if updating password
        if self.request and 'password' in self.request.data:
            return ChangePasswordSerializer
        return UserDetailsSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# Vue pour récupérer l'utilisateur courant via token actuel
class CurrentUserView(generics.RetrieveAPIView):
    # queryset = User.objects.all()
    serializer_class = UserDetailsSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    # @ensure_csrf_cookie
    @csrf_exempt     
    def get_object(self):
        """
        Override the typical get_object method to return the User object
        associated with the request.user.
        """
        return self.request.user
    

class UserSharedHouseProfiles(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user_ids = request.data.get('user_ids', [])
        
        if not user_ids:
            return Response({"error": "No user ids provided"}, status=status.HTTP_400_BADB_REQUEST)

        # Récupérer les foyers en commun avec l'utilisateur authentifié
        shared_houses = House.objects.filter(users=request.user)
        
        # Recherche des utilisateurs parmi les ids donnés
        potential_shared_users = User.objects.filter(id__in=user_ids).distinct()

        # Filtrer seulement ceux qui sont dans les foyers partagés
        shared_users = [user for user in potential_shared_users if shared_houses.intersection(user.house_set.all()).exists()]

        # Prépare la réponse
        result = [{
            'id': user.id,
            'name': user.username,
            'avatar': user.profile.avatar if hasattr(user, 'profile') and user.profile and user.profile.avatar else None
        } for user in shared_users]

        return Response(result)

