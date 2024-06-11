from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from .models import House, HouseworkPossibleTask
from .serializers import HouseSerializer, HouseworkPossibleTaskSerializer, HouseworkMadeTaskSerializer, HistorySerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


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
@method_decorator(csrf_exempt, name='dispatch')
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
# @ensure_csrf_cookie
@method_decorator(csrf_exempt, name='dispatch')
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
@method_decorator(csrf_exempt, name='dispatch')
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
# @ensure_csrf_cookie
@method_decorator(csrf_exempt, name='dispatch')
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
            return Response(serializer.errors, status=status.HTTP_400_BAD_NOT_FOUND)