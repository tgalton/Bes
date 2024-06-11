# bes/account/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import HouseScore, UserProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken



# Serializer pour le modèle HouseScore
class HouseScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = HouseScore
        fields = ['id', 'user', 'house', 'current_score']

# Serializer pour le modèle UserProfile
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ('user',)  # Assure that user is not updated via API directly

    def create(self, validated_data):
        # Vous pouvez ajouter des logiques personnalisées ici
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Logique de mise à jour personnalisée
        return super().update(instance, validated_data)

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

#Serialiseur pour la connexion (token)    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.EMAIL_FIELD

    def validate(self, attrs):
        email = attrs.get("email", "")
        password = attrs.get("password", "")

        print(f"Received email: {email}, password: {password}")  # Cette ligne pour déboguer

        user = User.objects.filter(email=email).first()
        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user_id": user.id,
            }
        else:
            raise serializers.ValidationError("Invalid email or password")


