from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    avatar_url = models.URLField(blank=True)
    role = models.CharField(max_length=20, choices=[
        ('ADMIN', 'Administrador'),
        ('SUPERVISOR', 'Supervisor / Líder Wayuu'),
        ('RESIDENT', 'Residente'),
    ], default='RESIDENT')
    preferred_language = models.CharField(max_length=5, default='es')
    notification_preferences = models.JSONField(default=dict)

    def __str__(self):
        return f"{self.username} ({self.role})"
