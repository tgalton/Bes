from django.urls import path
from . import views

#Available routes
urlpatterns = [
    path('api/houses/', views.house_list),
    path('api/houses/<int:pk>/', views.house_detail),
]