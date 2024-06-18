# bes/account/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import HouseScore, UserProfile, House
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password




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

# Serialiseur de changement de password
class ChangePasswordSerializer(serializers.ModelSerializer):
    # Ici nous ajoutons une validation de mot de passe de Django en tant que validateur
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
    
# Puisque le modèle front-end Angular attend un user
# qui comprend des attributs à la fois de User et de UserProfile,
# on utilise un serializer qui compose ces deux modèles.
class UserDetailsSerializer(serializers.ModelSerializer):
    isActive = serializers.BooleanField(source='profile.is_active')
    hearths = serializers.SlugRelatedField(
        many=True,
        slug_field='name',
        queryset=House.objects.all(),
        source='house_set'
    )
    avatar = serializers.CharField(source='profile.avatar', allow_blank=True, required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'isActive', 'hearths', 'avatar')
        extra_kwargs = {
            'username': {'required': False},
            'password': {'write_only': True, 'required': False},
        }

    # def to_representation(self, instance):
    #     """Manipulate data representation based on the context."""
    #     ret = super().to_representation(instance)
    #     # Remove email information if not the self user view
    #     if not self.context.get('include_email', False):
    #         ret.pop('email', None)
    #     return ret

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})
        hearths = validated_data.pop('house_set', [])
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user, **profile_data)
        user.house_set.set(hearths)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        hearths = validated_data.pop('house_set', [])

        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.house_set.set(hearths)
        
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        
        instance.save()

        # Update UserProfile
        for attr, value in profile_data.items():
            setattr(instance.profile, attr, value)
        instance.profile.save()

        return instance

