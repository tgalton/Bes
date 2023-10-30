from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from .models import House, HouseworkPossibleTask, HouseworkMadeTask, History
from .serializers import HouseSerializer, HouseworkPossibleTaskSerializer, HouseworkMadeTaskSerializer, HistorySerializer


# TODO: ajouter :
# (login_url="/accounts/login/") au tag "login_required"
# ou 
# from django.contrib.auth import views as auth_views
# path("accounts/login/", auth_views.LoginView.as_view()),
@login_required
@csrf_exempt
def house_list(request):
    """
    List all houses, or create a new house.
    """
    current_user = request.user
    if request.method == 'GET':
        # A user can only see their own houses
        houses = House.objects.filter(users__id=current_user.id).all()
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
@csrf_exempt
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