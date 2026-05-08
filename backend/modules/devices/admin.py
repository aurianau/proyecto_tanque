from django.contrib import admin
from .models import Microcontroller, Tank, Sensor, Valve

@admin.register(Microcontroller)
class MicrocontrollerAdmin(admin.ModelAdmin):
    list_display = ('name', 'mac_address', 'community', 'is_online', 'battery_level')
    list_filter = ('is_online', 'community')
    search_fields = ('name', 'mac_address')

@admin.register(Tank)
class TankAdmin(admin.ModelAdmin):
    list_display = ('name', 'microcontroller', 'capacity_liters', 'current_level_pct', 'status')
    list_filter = ('status', 'microcontroller')

@admin.register(Sensor)
class SensorAdmin(admin.ModelAdmin):
    list_display = ('sensor_type', 'tank', 'is_active')
    list_filter = ('sensor_type', 'is_active')

@admin.register(Valve)
class ValveAdmin(admin.ModelAdmin):
    list_display = ('name', 'tank', 'is_open', 'last_toggled')
    list_filter = ('is_open',)
