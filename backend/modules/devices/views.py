from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Microcontroller, Tank, Sensor, Valve
from .serializers import MicrocontrollerSerializer, TankSerializer, SensorSerializer, ValveSerializer
from django.utils import timezone

class MicrocontrollerViewSet(viewsets.ModelViewSet):
    queryset = Microcontroller.objects.all()
    serializer_class = MicrocontrollerSerializer
    permission_classes = [permissions.AllowAny]

class TankViewSet(viewsets.ModelViewSet):
    queryset = Tank.objects.all()
    serializer_class = TankSerializer
    permission_classes = [permissions.AllowAny]

class SensorViewSet(viewsets.ModelViewSet):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer
    permission_classes = [permissions.AllowAny]

class ValveViewSet(viewsets.ModelViewSet):
    queryset = Valve.objects.all()
    serializer_class = ValveSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=True, methods=['post'])
    def toggle(self, request, pk=None):
        valve = self.get_object()
        valve.is_open = not valve.is_open
        valve.last_toggled = timezone.now()
        valve.toggled_by = request.user
        valve.save()
        
        # In a real scenario, here we would send a message to MQTT
        # For now, we return the new state
        return Response({
            'status': 'valve toggled',
            'is_open': valve.is_open
        })
