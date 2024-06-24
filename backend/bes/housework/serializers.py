from rest_framework import serializers
from .models import House, HouseworkPossibleTask, HouseworkMadeTask, History
from django.utils import timezone
from django.contrib.auth.models import User

class UserHouseDetailSerializer(serializers.ModelSerializer):
    avatar = serializers.CharField(source='profile.avatar', read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'avatar']

class HouseSerializer(serializers.ModelSerializer):
    hearthUsers = UserHouseDetailSerializer(many=True, required=False)

    class Meta:
        model = House
        fields = ['id', 'name', 'hearthUsers', 'imageName', 'admin_user']

    def update(self, instance, validated_data):
        user = self.context['request'].user  # Récupère l'utilisateur à partir du contexte de la requête
        
        # Vérifie si l'utilisateur est l'administrateur de la maison
        if instance.admin_user != user:
            raise serializers.ValidationError("Seul l'administrateur de la maison peut modifier les informations.")
        
        instance.name = validated_data.get('name', instance.name)
        instance.imageName = validated_data.get('imageName', instance.imageName)
        instance.admin_user = validated_data.get('admin_user', instance.admin_user)
        
        instance.save()
        return instance


class HouseworkPossibleTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = HouseworkPossibleTask
        fields = ['id', 'name', 'house', 'duration', 'difficulty']

    def create(self, validated_data):
        # Insérez ici la logique de contrôle avant la création :
        # Par exemple, empêcher la création de doublons dans un même foyer
        if HouseworkPossibleTask.objects.filter(name=validated_data['name'], house=validated_data['house']).exists():
            raise serializers.ValidationError("Cette tâche est déjà définie pour ce foyer.")
        return HouseworkPossibleTask.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
    # Mettez à jour chaque champ selon les données envoyées
        instance.name = validated_data.get('name', instance.name)
        instance.house = validated_data.get('house', instance.house)
        instance.duration = validated_data.get('duration', instance.duration)
        instance.difficulty = validated_data.get('difficulty', instance.difficulty)
        # Ajoutez ici la logique de validation si nécessaire
        instance.save()
        return instance

class HouseworkMadeTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = HouseworkMadeTask
        fields = ['id', 'name', 'score', 'date', 'duration', 'difficulty', 'user', 'house']

# Warning : Doublon ?!
class HouseworkMadeTaskDateRangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = HouseworkMadeTask
        fields = ['id', 'name', 'score', 'date', 'duration', 'difficulty', 'user', 'house']

# Serialiseur d'ajout de tâches réalisées


class HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = ['id', 'action_log', 'action_date', 'house']
