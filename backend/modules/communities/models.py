from django.db import models
from django.conf import settings

class Community(models.Model):
    name = models.CharField(max_length=200)  # "Ranchería La Sabana"
    latitude = models.DecimalField(max_digits=10, decimal_places=7)
    longitude = models.DecimalField(max_digits=10, decimal_places=7)
    leader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='led_communities')
    status = models.CharField(max_length=10, choices=[('ACTIVE', 'Activa'), ('INACTIVE', 'Inactiva')], default='ACTIVE')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Household(models.Model):
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='households')
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='households')
    name = models.CharField(max_length=200, default="Vivienda")
    address = models.CharField(max_length=300)
    members_count = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.owner.username} - {self.community.name}"
