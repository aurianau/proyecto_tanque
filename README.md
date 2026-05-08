# 🌊 HydroSmart Pro 3.0

**Plataforma IoT Premium para el Monitoreo Inteligente de Agua**

HydroSmart Pro es una solución integral diseñada para la gestión eficiente de recursos hídricos en comunidades y urbanizaciones. Combina hardware basado en ESP32, un backend robusto en Django y una interfaz de usuario Next.js 15 de última generación.

## 🚀 Características Principales

- **Dashboard en Tiempo Real**: Telemetría instantánea mediante WebSockets y MQTT.
- **Visualización 3D/SVG**: Tanques de agua animados con efectos de cristal y oleaje dinámico.
- **Gestión Multi-Comunidad**: Controla múltiples urbanizaciones, tanques y viviendas desde un solo lugar.
- **Analítica Avanzada**: Historial de consumo y niveles mediante gráficas interactivas (Recharts).
- **Sistema de Alertas**: Detección automática de niveles críticos, desbordamientos y fallas de batería.
- **Seguridad JWT**: Autenticación protegida con tokens de acceso y refresco.

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Estilos**: Tailwind CSS 4
- **Componentes**: Shadcn/UI + Lucide Icons
- **Estado**: SWR (Data Fetching)
- **Animaciones**: Framer Motion

### Backend
- **Core**: Django 5.x + Django REST Framework
- **Tiempo Real**: Django Channels + Daphne (ASGI)
- **IoT Bridge**: Paho-MQTT Listener
- **Base de Datos**: PostgreSQL (Producción) / SQLite (Local)

---

## 💻 Instalación Local

### Requisitos
- Node.js 18+
- Python 3.10+
- Broker MQTT (Ej: EMQX público o local)

### 1. Clonar y configurar Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate # o venv\Scripts\activate en Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2. Iniciar el puente MQTT (Worker)
```bash
# En una nueva terminal
python manage.py mqtt_listener
```

### 3. Configurar Frontend
```bash
cd frontend
npm install
npm run dev
```
Acceder a `http://localhost:3000`

---

## 📦 Despliegue en Producción

### Backend (Railway)
1. Conectar repositorio de GitHub.
2. Añadir variables de entorno (DATABASE_URL, SECRET_KEY).
3. El `Procfile` iniciará automáticamente el servidor y el listener MQTT.

### Frontend (Vercel)
1. Conectar repositorio de GitHub.
2. Configurar `NEXT_PUBLIC_API_URL` apuntando a tu servidor de Railway.

---

Desarrollado por **HydroSmart Team**. 2026.
