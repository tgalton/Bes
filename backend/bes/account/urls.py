from django.urls import path
from .views import CustomTokenObtainPairView, UserCreateView, CurrentUserView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', UserCreateView.as_view(), name='user_register'),
    path('user/self', CurrentUserView.as_view(), name='current-user'),
]