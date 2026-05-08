from django.contrib import admin
from .models import Alert

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ('title', 'community', 'level', 'is_resolved', 'created_at')
    list_filter = ('level', 'is_resolved', 'community')
    search_fields = ('title', 'description')
