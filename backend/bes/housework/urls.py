from django.urls import path
from . import views
from .views import  HouseViewSet, HouseworkMadeTaskDateRangeView, generate_invitation, accept_invitation
from django.views.decorators.csrf import csrf_exempt

#Available routes
urlpatterns = [
    # Requête pour les maison / foyers
    path('api/houses/', views.house_list),
    path('api/houses/details', HouseViewSet.as_view({'get': 'list'})),
    path('api/houses/<int:pk>/', views.house_detail),
    
    # Requête pour les tâches
    path('api/houses/<int:house_id>/tasks/', views.get_possible_tasks, name='house_tasks'),
    path('api/tasks/possible/add/', views.add_possible_task, name='add_possible_task'),
    path('api/tasks/possible/<int:task_id>/update/', csrf_exempt(views.update_possible_task), name='update_possible_task'),
    path('api/tasks/made/date-range/', HouseworkMadeTaskDateRangeView.as_view(), name='housework-made-task-date-range'),
    path('api/tasks/made/create-multiple/', views.create_multiple_made_tasks, name='create_multiple_made_tasks'),
    # Requêtes pour les invitation
    path('api/houses/<int:house_id>/invite/', generate_invitation),
    path('api/invite/accept/<uuid:token>/', accept_invitation),
    
]