from rest_framework import viewsets, mixins
from .models import WaterLevelReading
from .serializers import WaterLevelReadingSerializer

class WaterLevelReadingViewSet(viewsets.ModelViewSet):
    queryset = WaterLevelReading.objects.all().order_by('-timestamp')
    serializer_class = WaterLevelReadingSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        tank_id = self.request.query_params.get('tank')
        if tank_id:
            queryset = queryset.filter(tank_id=tank_id)
        return queryset
