from django.contrib import admin
from .models import Alert

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ('alert_type', 'tank', 'severity', 'is_resolved', 'created_at')
    list_filter = ('severity', 'is_resolved', 'tank')
    search_fields = ('message',)
