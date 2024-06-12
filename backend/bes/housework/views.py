

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from .models import House, HouseInvitation, HouseworkMadeTask, HouseworkPossibleTask
from .serializers import HouseSerializer, HouseworkMadeTaskDateRangeSerializer, HouseworkPossibleTaskSerializer, HouseworkMadeTaskSerializer, HistorySerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework import views
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.utils import timezone
from django.utils.timezone import make_aware
from django.utils.dateparse import parse_datetime





# TODO: ajouter :
# (login_url="/accounts/login/") au tag "login_required"
# ou 
# from django.contrib.auth import views as auth_views
# path("accounts/login/", auth_views.LoginView.as_view()),
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])  # Assurez-vous que seuls les utilisateurs authentifiés peuvent y accéder
def house_list(request):
    """
    List all houses for the authenticated user, or create a new house.
    """
    # Pour récupérer l'ensemble des maisons d'un utilisateur
    if request.method == 'GET':
        # Un utilisateur ne peut voir que ses propres maisons
        houses = House.objects.filter(users__id=request.user.id).all()
        serializer = HouseSerializer(houses, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = HouseSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    

@login_required
# @ensure_csrf_cookie
@csrf_exempt
# @method_decorator(csrf_exempt, name='dispatch')
def house_detail(request, pk):
    """
    Retrieve, update or delete a code house.
    """
    try:
        house = House.objects.get(pk=pk)
    except House.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = HouseSerializer(house)
        return JsonResponse(serializer.data)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = HouseSerializer(house, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        house.delete()
        return HttpResponse(status=204)



# Vue pour récupérer l'ensemble des tâches disponibles dans un foyer
# dont l'utilisateur doit faire partie
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_possible_tasks(request, house_id):
    """
    Retrieve all possible tasks for a given house that the authenticated user is part of.
    """
    if not House.objects.filter(id=house_id, users__id=request.user.id).exists():
        return Response({'error': 'User not part of the house or house does not exist'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        tasks = HouseworkPossibleTask.objects.filter(house__id=house_id)
        serializer = HouseworkPossibleTaskSerializer(tasks, many=True)
        return Response(serializer.data)



# Vue pour créer une nouvelle tâche possible dans une maison
@api_view(['POST'])
# @ensure_csrf_cookie
@csrf_exempt
# @method_decorator(csrf_exempt, name='dispatch')
@permission_classes([IsAuthenticated])
def add_possible_task(request):
    # Récupération de l'ID de la maison depuis la requête
    house_id = request.data.get('house')
    if not House.objects.filter(id=house_id, users__id=request.user.id).exists():
        return Response({'error': 'User not part of this house or house does not exist'}, status=status.HTTP_403_FORBIDDEN)
    
    serializer = HouseworkPossibleTaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

#Vue pour update une tâche possible
@api_view(['PUT', 'PATCH'])
@csrf_exempt
@permission_classes((IsAuthenticated,))
def update_possible_task(request, task_id):
    try:
        task = HouseworkPossibleTask.objects.get(id=task_id)
    except HouseworkPossibleTask.DoesNotExist:
        return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Vérification que l’utilisateur appartient à la maison associée à la tâche
    if not task.house.users.filter(id=request.user.id).exists():
        return Response({'error': 'User is not a member of the house associated with this task'}, status=status.HTTP_403_FORBIDDEN)

    if request.method in ['PUT', 'PATCH']:
        serializer = HouseworkPossibleTaskSerializer(task, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=404)
        
# Vue pour créer une invitation dans une house
# TODO: vérification d'être dans cette house
@api_view(['POST'])
@csrf_exempt
# @method_decorator(csrf_exempt, name='dispatch')
@permission_classes([IsAuthenticated])
def generate_invitation(request, house_id):
    house = House.objects.filter(id=house_id, users=request.user).first()
    if not house:
        return Response({'error': 'House not found or access denied'}, status=status.HTTP_404_NOT_FOUND)
    
    invitation = HouseInvitation.objects.create(house=house, invited_by=request.user)
    return Response({'token': str(invitation.token)}, status=status.HTTP_201_CREATED)

# Vue pour accepter une invitation via Token dans une House
@api_view(['POST'])
@csrf_exempt
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
    
# Permet d'enrigistrer une liste de tâches réalisées à son nom.
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

@permission_classes([IsAuthenticated])
class HouseViewSet(viewsets.ReadOnlyModelViewSet):
    """ 
    Affiche les maisons avec les détails des utilisateurs incluant l'avatar et le nom d'utilisateur.
    """
    queryset = House.objects.all()
    serializer_class = HouseSerializer
