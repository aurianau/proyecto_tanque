from django.contrib import admin
from .models import Community, Household

@admin.register(Community)
class CommunityAdmin(admin.ModelAdmin):
    list_display = ('name', 'latitude', 'longitude', 'status', 'leader')
    search_fields = ('name',)

@admin.register(Household)
class HouseholdAdmin(admin.ModelAdmin):
    list_display = ('name', 'community', 'owner', 'members_count')
    list_filter = ('community',)
