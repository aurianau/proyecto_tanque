from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CommunityViewSet, HouseholdViewSet

router = DefaultRouter()
router.register(r'communities', CommunityViewSet)
router.register(r'households', HouseholdViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
