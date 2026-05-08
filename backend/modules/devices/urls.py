from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MicrocontrollerViewSet, TankViewSet, SensorViewSet, ValveViewSet

router = DefaultRouter()
router.register(r'microcontrollers', MicrocontrollerViewSet)
router.register(r'tanks', TankViewSet)
router.register(r'sensors', SensorViewSet)
router.register(r'valves', ValveViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
