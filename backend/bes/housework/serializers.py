from rest_framework import serializers
from .models import House, HouseworkPossibleTask, HouseworkMadeTask, History


class HouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = House
        fields = ['id', 'name', 'users']


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


class HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = ['id', 'action_log', 'action_date', 'house']
