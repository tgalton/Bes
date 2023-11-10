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


class HouseworkMadeTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = HouseworkMadeTask
        fields = ['id', 'name', 'score', 'date', 'duration', 'difficulty', 'user', 'house']


class HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = ['id', 'action_log', 'action_date', 'house']
