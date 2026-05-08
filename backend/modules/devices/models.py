from django.db import models
from modules.communities.models import Community, Household
from django.conf import settings

class Microcontroller(models.Model):
    mac_address = models.CharField(max_length=17, unique=True)
    name = models.CharField(max_length=100)  # "ESP32-Tanque Norte"
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='microcontrollers')
    firmware_version = models.CharField(max_length=20, blank=True)
    is_online = models.BooleanField(default=False)
    last_seen = models.DateTimeField(null=True, blank=True)
    battery_level = models.FloatField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.mac_address})"

class Tank(models.Model):
    microcontroller = models.ForeignKey(Microcontroller, on_delete=models.CASCADE, related_name='tanks')
    household = models.ForeignKey(Household, on_delete=models.SET_NULL, null=True, blank=True, related_name='tanks')
    name = models.CharField(max_length=100)
    capacity_liters = models.FloatField()
    height_cm = models.FloatField()
    current_level_pct = models.FloatField(default=0)
    status = models.CharField(max_length=20, choices=[
        ('NORMAL', 'Normal'),
        ('WARNING', 'Advertencia'),
        ('CRITICAL', 'Crítico'),
        ('OVERFLOW', 'Desbordamiento'),
    ], default='NORMAL')

    def __str__(self):
        return f"{self.name} - {self.microcontroller.name}"

class Sensor(models.Model):
    tank = models.ForeignKey(Tank, on_delete=models.CASCADE, related_name='sensors')
    sensor_type = models.CharField(max_length=20, choices=[
        ('ULTRASONIC', 'Ultrasónico'),
        ('FLOW', 'Flujo de Agua'),
        ('PH', 'pH'),
        ('TEMPERATURE', 'Temperatura'),
    ])
    pin = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.sensor_type} on {self.tank.name}"

class Valve(models.Model):
    tank = models.ForeignKey(Tank, on_delete=models.CASCADE, related_name='valves')
    name = models.CharField(max_length=100)
    pin = models.PositiveIntegerField()
    is_open = models.BooleanField(default=False)
    last_toggled = models.DateTimeField(null=True, blank=True)
    toggled_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.name} on {self.tank.name}"
