from django.db import models
from modules.devices.models import Sensor, Tank

class WaterLevelReading(models.Model):
    """
    Esta tabla se convierte en una Hypertable de TimescaleDB
    para queries temporales ultra-rápidos.
    """
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, related_name='readings')
    tank = models.ForeignKey(Tank, on_delete=models.CASCADE, related_name='readings')
    level_pct = models.FloatField()
    distance_cm = models.FloatField()  # Lectura raw del sensor
    volume_liters = models.FloatField()
    timestamp = models.DateTimeField(db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=['sensor', 'timestamp']),
            models.Index(fields=['tank', 'timestamp']),
        ]

    def __str__(self):
        return f"{self.tank.name} - {self.level_pct}% at {self.timestamp}"
