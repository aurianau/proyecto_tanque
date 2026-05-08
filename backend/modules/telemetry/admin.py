from django.contrib import admin
from .models import WaterLevelReading

@admin.register(WaterLevelReading)
class WaterLevelReadingAdmin(admin.ModelAdmin):
    list_display = ('tank', 'level_pct', 'volume_liters', 'timestamp')
    list_filter = ('tank', 'timestamp')
    date_hierarchy = 'timestamp'
    readonly_fields = ('timestamp',)
