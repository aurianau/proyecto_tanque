from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Auth
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Modules
    path('api/core/', include('modules.core.urls')),
    path('api/communities/', include('modules.communities.urls')),
    path('api/devices/', include('modules.devices.urls')),
    path('api/telemetry/', include('modules.telemetry.urls')),
    path('api/alerts/', include('modules.alerts.urls')),
    # path('api/dashboard/', include('modules.analytics.urls')),
]
