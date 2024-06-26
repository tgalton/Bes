
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from .models import House, HouseInvitation, HouseworkMadeTask, HouseworkPossibleTask
from .serializers import HouseSerializer, HouseworkMadeTaskDateRangeSerializer, HouseworkPossibleTaskSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import views
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.utils.dateparse import parse_datetime











# TODO: ajouter :
# (login_url="/accounts/login/") au tag "login_required"
# ou 
# from django.contrib.auth import views as auth_views
# path("accounts/login/", auth_views.LoginView.as_view()),
class HouseList(APIView):
    """
    List all houses of a user or create a new house.
    """
    @permission_classes([IsAuthenticated])
    def get(self, request):
        houses = House.objects.filter(users__id=request.user.id).all()
        serializer = HouseSerializer(houses, many=True)
        return Response(serializer.data)

    @permission_classes([IsAuthenticated])
    def post(self, request):
        serializer = HouseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# ViewSet si  objectif est de fournir une interface API standard pour les opérations CRUD sur House, et bénéficier de l'automatisation offerte par les routeurs de 
# DRF pour lier les routes aux méthodes du ViewSet.
class HouseViewSet(viewsets.ViewSet):
    """
    A ViewSet for listing, retrieving, creating, and deleting Houses.
    """
    permission_classes = [IsAuthenticated]

    def list(self, request):
        queryset = House.objects.all()
        serializer = HouseSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        house = self.get_object()
        serializer = HouseSerializer(house)
        return Response(serializer.data)

    def create(self, request):
        # On crée une nouvelle maison avec les paramètres par défaut
        default_name = "Nouveau foyer"
        default_image_name = "defaultHouse"
        user = request.user
        house = House.objects.create(
            name=default_name,
            admin_user=user,
            imageName=default_image_name
        )
        house.hearthUsers.add(user)  # Ajoute également l'utilisateur comme membre de la maison
        house.save()
        serializer = HouseSerializer(house)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, pk=None):
        house = self.get_object()
        # Vérifie si l'utilisateur est l'admin de la maison
        if house.admin_user != request.user:
            return Response({"message": "Seul l'administrateur peut supprimer la maison."}, status=status.HTTP_403_FORBIDDEN)
        house.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_object(self):
        # Cette méthode doit être modifiée pour récupérer l'objet House en fonction du paramètre 'pk'
        return self.queryset.get(pk=self.kwargs.get('pk'))

# HouseDetail (ou toute autre vue spécifique) pour gérer des exigences qui dépassent l'interface CRUD 
# standard ou qui nécessitent un traitement ou des réponses API très spécifiques et personnalisées.
class HouseDetail(APIView):
    """
    Retrieve, update, or delete a house.
    """
    @permission_classes([IsAuthenticated])
    def get(self, request, pk):
        try:
            house = House.objects.get(pk=pk)
        except House.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = HouseSerializer(house)
        return Response(serializer.data)

    @permission_classes([IsAuthenticated])
    def put(self, request, pk):
        try:
            house = House.objects.get(pk=pk)
        except House.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # Utilisez "partial=True" pour permettre la mise à jour partielle
        serializer = HouseSerializer(house, data=request.data, partial=True, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @permission_classes([IsAuthenticated])
    def delete(self, request, pk):
        try:
            house = House.objects.get(pk=pk)
        except House.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        house.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



# Vue pour récupérer l'ensemble des tâches disponibles dans un foyer
# dont l'utilisateur doit faire partie
# Vue pour créer une nouvelle tâche possible dans une maison
#Vue pour update une tâche possible
from rest_framework.exceptions import PermissionDenied

class HouseworkPossibleTaskView(APIView):
    """
    API endpoint that allows getting, posting, updating, and deleting possible tasks.
    """
    permission_classes = [IsAuthenticated]

    def check_house_membership(self, house_id, user):
        """Vérifie si l'utilisateur fait partie de la maison donnée."""
        if not House.objects.filter(id=house_id, hearthUsers=user).exists():
            raise PermissionDenied("Vous n'appartenez pas à cette maison.")

    def get(self, request, house_id=None):
        if house_id:
            self.check_house_membership(house_id, request.user)
            tasks = HouseworkPossibleTask.objects.filter(house__id=house_id)
        else:
            tasks = HouseworkPossibleTask.objects.all()

        serializer = HouseworkPossibleTaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request):
        house_id = request.data.get('house')
        self.check_house_membership(house_id, request.user)
        
        serializer = HouseworkPossibleTaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, task_id):
        task = HouseworkPossibleTask.objects.get(id=task_id)
        self.check_house_membership(task.house_id, request.user)

        serializer = HouseworkPossibleTaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, task_id):
        task = HouseworkPossibleTask.objects.get(id=task_id)
        self.check_house_membership(task.house_id, request.user)

        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

        
# Vue pour créer une invitation dans une house
# TODO: vérification d'être dans cette house
@api_view(['POST'])
@csrf_exempt
# @method_decorator(csrf_exempt, name='dispatch')
@permission_classes([IsAuthenticated])
def generate_invitation(request, house_id):
    print("User ID:", request.user.id)  # assurez-vous d’avoir l'ID
    print("House ID:", house_id)  # ID de la maison
    house = House.objects.filter(id=house_id, hearthUsers=request.user).first()
    print("House:", house)
    if not house:
        return Response({'error': 'House not found or access denied'}, status=status.HTTP_404_NOT_FOUND)
    
    invitation = HouseInvitation.objects.create(house=house, invited_by=request.user)
    return Response({'token': str(invitation.token)}, status=status.HTTP_201_CREATED)

# Vue pour accepter une invitation via Token dans une House
@api_view(['POST'])
@csrf_exempt
@permission_classes([IsAuthenticated])
def accept_invitation(request, token):
    try:
        invitation = HouseInvitation.objects.get(token=token, expires_at__gte=timezone.now())
    except HouseInvitation.DoesNotExist:
        return Response({'error': 'Invalid or expired token'}, status=status.HTTP_404_NOT_FOUND)
    
    house = invitation.house
    if request.user in house.users.all():
        return Response({'message': 'You are already a member of this house'}, status=status.HTTP_400_BAD_REQUEST)

    house.users.add(request.user)
    house.save()
    invitation.delete()  # Optionally delete the invitation after use
    return Response({'message': f'You have joined {house.name}'}, status=status.HTTP_200_OK)


# Récupère la liste des tâches réalisées entre deux dates :
# Cette vue filtre les instances de HouseworkMadeTask sur la base des paramètres start_date, end_date, et house_id.
# Format de date conforme à ISO 8601 incluant le timezone UTC
@permission_classes([IsAuthenticated])
class HouseworkMadeTaskDateRangeView(views.APIView):
    def get(self, request, *args, **kwargs):
        # Récupérer les paramètres de la requête
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        house_id = request.query_params.get('house_id')
        
        # Convertir les chaînes des dates en objets datetime conscients directement
        try:
            start_date = parse_datetime(start_date)
            end_date = parse_datetime(end_date)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except TypeError:
            return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validation de présence des dates et de l'ID de la maison
        if not all([start_date, end_date, house_id]):
            return Response({'error': 'Missing required parameters'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Filtrage des tâches réalisées
        tasks = HouseworkMadeTask.objects.filter(
            date__gte=start_date,
            date__lte=end_date,
            house_id=house_id
        )
        
        # Sérialisation des données
        serializer = HouseworkMadeTaskDateRangeSerializer(tasks, many=True)
        return Response(serializer.data)
    
# Permet d'enregistrer une liste de tâches réalisées à son nom.
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_multiple_made_tasks(request):
    # Extrait les données de la requête
    task_list = request.data

    created_tasks = []
    errors = []

    for task in task_list:
        possible_task_id = task.get('possible_task_id')
        count = task.get('count')

        try:
            possible_task = HouseworkPossibleTask.objects.get(id=possible_task_id)
            
            # Vérifie que l'utilisateur est bien membre de la maison
            if not possible_task.house.users.filter(id=request.user.id).exists():
                errors.append({"possible_task_id": possible_task_id, "error": "User is not a member of the house"})
                continue

            # Crée les tâches réalisées
            for _ in range(count):
                made_task = HouseworkMadeTask.objects.create(
                    name=possible_task.name,
                    date=timezone.now(),
                    duration=possible_task.duration,
                    difficulty=possible_task.difficulty,
                    user=request.user,
                    house=possible_task.house,
                    score=0  # à définir selon la logique voulue
                )
                created_tasks.append(made_task.id)

        except HouseworkPossibleTask.DoesNotExist:
            errors.append({"possible_task_id": possible_task_id, "error": "Possible task not found"})

    if errors:
        return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({"created_tasks_ids": created_tasks}, status=status.HTTP_201_CREATED)



class RemoveUserFromHouse(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, house_id, user_id):
        # Récupération de la maison par son ID
        house = get_object_or_404(House, id=house_id)

        # Récupération de l'utilisateur à enlever
        user_to_remove = get_object_or_404(User, id=user_id)

        # Vérification si l'utilisateur qui fait la requête est l'administrateur de la maison
        if request.user != house.admin_user:
            return Response({"message": "Seul l'administrateur peut retirer un utilisateur."}, status=status.HTTP_403_FORBIDDEN)

        # Vérification si l'utilisateur est actuellement membre de la maison
        if user_to_remove not in house.hearthUsers.all():
            return Response({"message": "L'utilisateur n'est pas membre de cette maison."}, status=status.HTTP_404_NOT_FOUND)

        # Retrait de l'utilisateur
        house.hearthUsers.remove(user_to_remove)

        # Sauvegarde des modifications
        house.save()

        return Response({"message": f"L'utilisateur {user_to_remove.username} a été retiré de {house.name}"}, status=status.HTTP_204_NO_CONTENT)


