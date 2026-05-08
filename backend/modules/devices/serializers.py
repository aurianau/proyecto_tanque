from rest_framework import serializers
from .models import Microcontroller, Tank, Sensor, Valve

class SensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = '__all__'

class ValveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Valve
        fields = '__all__'

class TankSerializer(serializers.ModelSerializer):
    sensors = SensorSerializer(many=True, read_only=True)
    valves = ValveSerializer(many=True, read_only=True)

    class Meta:
        model = Tank
        fields = '__all__'

class MicrocontrollerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Microcontroller
        exclude = ['ip_address']
