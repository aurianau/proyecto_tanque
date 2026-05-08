from rest_framework import serializers
from .models import WaterLevelReading

class WaterLevelReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterLevelReading
        fields = '__all__'
