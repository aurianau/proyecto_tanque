import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from modules.communities.models import Community, Household
from modules.devices.models import Microcontroller, Tank, Sensor, Valve
from django.contrib.auth import get_user_model

User = get_user_model()
admin = User.objects.get(username='admin')

def populate():
    # 1. Update existing community 'aremasai' to a correct location
    aremasai = Community.objects.filter(name='aremasai').first()
    if aremasai:
        aremasai.latitude = 11.5340
        aremasai.longitude = -72.9060
        aremasai.save()
        print(f"Updated {aremasai.name}")

    # 2. Create New Communities
    coms_data = [
        {"name": "Manaure Center", "lat": 11.775, "lng": -72.444, "level": 45},
        {"name": "Uribia Sector 2", "lat": 11.714, "lng": -72.266, "level": 85},
        {"name": "Maicao Frontera", "lat": 11.378, "lng": -72.243, "level": 20},
    ]

    for data in coms_data:
        com, created = Community.objects.get_or_create(
            name=data["name"],
            defaults={"latitude": data["lat"], "longitude": data["lng"], "leader": admin}
        )
        # Update existing ones too
        if not created:
            com.latitude = data["lat"]
            com.longitude = data["lng"]
            com.save()

        # Create/Update household
        house, h_created = Household.objects.get_or_create(
            community=com,
            owner=admin,
            name=f"Vivienda {com.name}",
            defaults={"address": f"Calle Principal {com.name}", "members_count": 5}
        )
        
        # Create/Update microcontroller
        mc, m_created = Microcontroller.objects.get_or_create(
            mac_address=f"AA:BB:CC:00:11:{com.id}",
            defaults={"name": f"ESP32-{com.name}", "community": com, "is_online": True}
        )
        
        # Create/Update Tank with different levels
        tank_obj = Tank.objects.filter(microcontroller=mc).first()
        if tank_obj:
            tank_obj.current_level_pct = data["level"]
            tank_obj.save()
            print(f"Updated Tank {tank_obj.name} to {data['level']}%")
        else:
            tank, t_created = Tank.objects.get_or_create(
                microcontroller=mc,
                household=house,
                name=f"Tanque {com.name}",
                defaults={"capacity_liters": 2000, "height_cm": 150, "current_level_pct": data["level"], "status": "NORMAL"}
            )
            print(f"Created Tank: {tank.name} with {data['level']}%")

if __name__ == "__main__":
    populate()
