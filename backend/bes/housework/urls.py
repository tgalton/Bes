from django.urls import path
from . import views

#Available routes
urlpatterns = [
    path('api/houses/', views.house_list),
    path('api/houses/<int:pk>/', views.house_detail),
    path('api/houses/<int:house_id>/tasks/', views.get_possible_tasks, name='house_tasks'),
    path('api/tasks/possible/add/', views.add_possible_task, name='add_possible_task'),
    path('api/tasks/possible/<int:task_id>/update/', views.update_possible_task, name='update_possible_task'),
]