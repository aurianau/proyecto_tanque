from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'phone_number', 'role', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        ('Información Adicional', {'fields': ('phone_number', 'role', 'profile_image')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Información Adicional', {'fields': ('phone_number', 'role', 'profile_image')}),
    )
