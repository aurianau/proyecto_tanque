from rest_framework import serializers
from .models import Community, Household

class CommunitySerializer(serializers.ModelSerializer):
    households = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    tanks = serializers.SerializerMethodField()

    class Meta:
        model = Community
        fields = ['id', 'name', 'latitude', 'longitude', 'leader', 'status', 'created_at', 'households', 'tanks']

    def get_tanks(self, obj):
        # Buscamos todos los tanques asociados a esta comunidad a través de los microcontroladores
        from modules.devices.models import Tank
        return Tank.objects.filter(microcontroller__community=obj).values_list('id', flat=True)

class HouseholdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Household
        fields = '__all__'
        read_only_fields = ('owner',)
