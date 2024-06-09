# bes/account/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import HouseScore, UserProfile


# Serializer pour le modèle HouseScore
class HouseScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = HouseScore
        fields = ['id', 'user', 'house', 'current_score']

# Serializer pour le modèle UserProfile
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'avatar']

# Sérialiseur pour la création d'utilisateur
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user