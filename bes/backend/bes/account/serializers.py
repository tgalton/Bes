from rest_framework import serializers
from .models import HouseScore, UserProfile


class HouseScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = HouseScore
        fields = ['id', 'user', 'house', 'current_score']


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'avatar']
