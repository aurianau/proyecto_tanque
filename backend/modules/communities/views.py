from rest_framework import viewsets, permissions
from .models import Community, Household
from .serializers import CommunitySerializer, HouseholdSerializer

class CommunityViewSet(viewsets.ModelViewSet):
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer
    permission_classes = [permissions.AllowAny] # Temporal para depuración

    def perform_create(self, serializer):
        # Asignar el líder automáticamente si hay un usuario autenticado
        if self.request.user.is_authenticated:
            serializer.save(leader=self.request.user)
        else:
            serializer.save()

class HouseholdViewSet(viewsets.ModelViewSet):
    queryset = Household.objects.all()
    serializer_class = HouseholdSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(owner=self.request.user)
        else:
            # Para desarrollo, si no hay login, usamos el primer usuario o uno por defecto
            from django.contrib.auth import get_user_model
            User = get_user_model()
            admin = User.objects.filter(is_superuser=True).first()
            serializer.save(owner=admin)
