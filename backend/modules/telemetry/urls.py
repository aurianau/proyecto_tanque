from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WaterLevelReadingViewSet

router = DefaultRouter()
router.register(r'readings', WaterLevelReadingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
