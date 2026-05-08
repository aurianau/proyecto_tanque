import json
from channels.generic.websocket import AsyncWebsocketConsumer

class TelemetryConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Allow connecting to a specific community or 'global'
        self.community_id = self.scope['url_route']['kwargs'].get('community_id', 'global')
        self.group_name = f'telemetry_{self.community_id}'

        # Join the channel group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the channel group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    # Receive message from WebSocket (Frontend to Backend)
    async def receive(self, text_data):
        data = json.loads(text_data)
        
        # Here we could handle commands from the frontend, e.g., opening a valve
        if data.get('action') == 'toggle_valve':
            valve_id = data.get('valve_id')
            # Handle valve toggle logic here
            # And potentially send an MQTT message to the ESP32
            pass

    # Receive message from room group (Backend/MQTT to Frontend)
    async def telemetry_update(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps(message))
