import json
import logging
import asyncio
from django.core.management.base import BaseCommand
from django.utils import timezone
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import paho.mqtt.client as mqtt

# Import models dynamically inside the command to avoid AppRegistryNotReady errors
from modules.devices.models import Microcontroller, Tank
from modules.telemetry.models import WaterLevelReading
from modules.alerts.models import Alert

logger = logging.getLogger(__name__)

# MQTT Broker settings (can be moved to settings.py)
MQTT_BROKER = "broker.emqx.io" # Public test broker. In production use your own.
MQTT_PORT = 1883
MQTT_KEEPALIVE_INTERVAL = 60
MQTT_TOPIC = "hydrosmart/+/telemetry" # + is the mac_address wildcard

class Command(BaseCommand):
    help = 'Starts the MQTT listener to receive telemetry data from ESP32s'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS(f'Starting MQTT listener on {MQTT_BROKER}:{MQTT_PORT}'))
        
        client = mqtt.Client(client_id="django_backend_listener")
        client.on_connect = self.on_connect
        client.on_message = self.on_message
        
        try:
            client.connect(MQTT_BROKER, MQTT_PORT, MQTT_KEEPALIVE_INTERVAL)
            # Blocking call that processes network traffic, dispatches callbacks and handles reconnecting.
            client.loop_forever()
        except KeyboardInterrupt:
            self.stdout.write(self.style.WARNING('\nStopping MQTT listener...'))
            client.disconnect()
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {e}'))

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            self.stdout.write(self.style.SUCCESS('Connected to MQTT Broker!'))
            client.subscribe(MQTT_TOPIC)
            self.stdout.write(self.style.SUCCESS(f'Subscribed to topic: {MQTT_TOPIC}'))
        else:
            self.stdout.write(self.style.ERROR(f'Failed to connect, return code {rc}'))

    def on_message(self, client, userdata, msg):
        topic = msg.topic
        payload = msg.payload.decode('utf-8')
        
        # Example Topic: hydrosmart/AA:BB:CC:DD:EE:FF/telemetry
        try:
            mac_address = topic.split('/')[1]
            data = json.loads(payload)
            
            # self.stdout.write(f"Received from {mac_address}: {data}")
            
            self.process_telemetry(mac_address, data)
        except Exception as e:
            logger.error(f"Error processing message from {topic}: {e}")

    def process_telemetry(self, mac_address, data):
        try:
            # 1. Find the device
            device = Microcontroller.objects.get(mac_address=mac_address)
            
            # Update device status
            device.is_online = True
            device.last_seen = timezone.now()
            if 'battery' in data:
                device.battery_level = data['battery']
            device.save()
            
            # 2. Process tank data
            if 'tanks' in data:
                for tank_data in data['tanks']:
                    # Assuming we map tank by some identifier, for now taking the first tank
                    # or mapping by sensor_pin if provided
                    tank = device.tanks.first() 
                    if not tank:
                        continue
                        
                    # Update current tank state
                    level_pct = tank_data.get('level_pct', 0)
                    tank.current_level_pct = level_pct
                    tank.save()

                    # --- AUTO ALERTS LOGIC ---
                    if level_pct < 10:
                        self.create_alert(tank, 'CRITICAL_LOW', 'CRITICAL', f"Nivel Crítico: El tanque '{tank.title}' está al {level_pct}%")
                    elif level_pct < 25:
                        self.create_alert(tank, 'CRITICAL_LOW', 'WARNING', f"Advertencia: El tanque '{tank.title}' tiene nivel bajo ({level_pct}%)")
                    elif level_pct > 95:
                        self.create_alert(tank, 'OVERFLOW', 'CRITICAL', f"¡ALERTA!: Riesgo de desbordamiento en '{tank.title}' ({level_pct}%)")
                    # -------------------------
                    
                    # 3. Save telemetry reading
                    sensor = tank.sensors.first() # Simplification
                    if sensor:
                        WaterLevelReading.objects.create(
                            sensor=sensor,
                            tank=tank,
                            level_pct=tank_data.get('level_pct', 0),
                            distance_cm=tank_data.get('distance_cm', 0),
                            volume_liters=tank_data.get('volume_liters', 0),
                            timestamp=timezone.now()
                        )
            
            # 4. Broadcast to WebSockets (Django Channels)
            channel_layer = get_channel_layer()
            
            # Format the message for the frontend
            ws_message = {
                'type': 'telemetry_update',
                'message': {
                    'mac': mac_address,
                    'community_id': device.community_id,
                    'data': data,
                    'timestamp': timezone.now().isoformat()
                }
            }
            
            # Send to global group
            async_to_sync(channel_layer.group_send)(
                'telemetry_global',
                ws_message
            )
            
            # Send to specific community group
            async_to_sync(channel_layer.group_send)(
                f'telemetry_{device.community_id}',
                ws_message
            )
            
        except Microcontroller.DoesNotExist:
            logger.warning(f"Ignored telemetry from unknown device: {mac_address}")
        except Exception as e:
            logger.error(f"Error saving telemetry: {e}")

    def create_alert(self, tank, alert_type, severity, message):
        """Helper to create an alert if one of the same type isn't already active."""
        active_alert = Alert.objects.filter(
            tank=tank, 
            alert_type=alert_type, 
            is_resolved=False
        ).exists()
        
        if not active_alert:
            Alert.objects.create(
                tank=tank,
                alert_type=alert_type,
                severity=severity,
                message=message
            )
            self.stdout.write(self.style.WARNING(f"ALERT CREATED: {alert_type} for {tank.title}"))
