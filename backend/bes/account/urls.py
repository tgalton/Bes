from django.urls import path
from .views import CustomTokenObtainPairView, UserCreateView, UserProfileDetailView, UserSharedHouseProfiles,UserUpdateView, CurrentUserView, csrf, UserProfileCreateView, UserProfileUpdateView
from rest_framework_simplejwt.views import TokenRefreshView



urlpatterns = [
    path('csrf/', csrf, name='csrf-token'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/register/', UserCreateView.as_view(), name='user-register'),
    path('user/update/', UserUpdateView.as_view(), name='user-update'),
    path('user/get/', CurrentUserView.as_view(), name='current-user'),
    path('user/<int:pk>/', UserProfileDetailView.as_view(), name='user-profile-detail'),
    path('user/profile/create/', UserProfileCreateView.as_view(), name='create-user-profile'),
    path('user/profile/update/', UserProfileUpdateView.as_view(), name='update-user-profile'),
    path('user/profiles/get_avatars/' , UserSharedHouseProfiles.as_view(), name='get-user-avatars-and-names'),
]
