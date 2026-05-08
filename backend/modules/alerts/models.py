from django.db import models
from modules.devices.models import Tank
from django.conf import settings

class Alert(models.Model):
    tank = models.ForeignKey(Tank, on_delete=models.CASCADE, related_name='alerts')
    alert_type = models.CharField(max_length=20, choices=[
        ('OVERFLOW', 'Desbordamiento'),
        ('CRITICAL_LOW', 'Nivel Crítico Bajo'),
        ('SENSOR_FAIL', 'Falla de Sensor'),
        ('DEVICE_OFFLINE', 'Dispositivo Desconectado'),
        ('VALVE_STUCK', 'Válvula Atascada'),
        ('BATTERY_LOW', 'Batería Baja'),
    ])
    severity = models.CharField(max_length=10, choices=[
        ('INFO', 'Información'),
        ('WARNING', 'Advertencia'),
        ('CRITICAL', 'Crítica'),
    ])
    message = models.TextField()
    is_resolved = models.BooleanField(default=False)
    resolved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_alerts')
    resolved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.alert_type} - {self.tank.name} ({self.severity})"
