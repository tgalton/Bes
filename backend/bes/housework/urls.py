from django.urls import path
from . import views
from .views import  HouseViewSet, HouseworkMadeTaskDateRangeView, HouseworkPossibleTaskView, RemoveUserFromHouse, generate_invitation, accept_invitation
from django.views.decorators.csrf import csrf_exempt

#Available routes
urlpatterns = [
    # Requête pour les maison / foyers
    path('api/houses/', views.HouseList.as_view()),
    path('api/houses/details/', HouseViewSet.as_view({'get': 'list'})),
    path('api/house/<int:pk>/', views.HouseDetail.as_view()),
    path('api/house/', views.HouseDetail.as_view()),
    path('api/house/<int:house_id>/remove_user/<int:user_id>/', RemoveUserFromHouse.as_view(), name='remove_user_from_house'),
    
    # Requête pour les tâches possible
    path('api/house/<int:house_id>/tasks/', HouseworkPossibleTaskView.as_view()),
    path('api/tasks/possible/add/', HouseworkPossibleTaskView.as_view()),
    path('api/tasks/possible/<int:task_id>/', HouseworkPossibleTaskView.as_view()),
    # Requête pour les tâches faîtes
    path('api/tasks/made/date-range/', HouseworkMadeTaskDateRangeView.as_view(), name='housework-made-task-date-range'),
    path('api/tasks/made/create-multiple/', views.create_multiple_made_tasks, name='create_multiple_made_tasks'),
    # Requêtes pour les invitation
    path('api/house/<int:house_id>/invite/', generate_invitation),
    path('api/invite/accept/<uuid:token>/', accept_invitation),
    
]