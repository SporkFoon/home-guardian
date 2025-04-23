# Home Guardian

A comprehensive home safety monitoring system that uses various sensors to detect potential hazards such as fire, gas leaks, and harmful air quality.

## Features

- **Real-time monitoring** of temperature, humidity, smoke, LPG, carbon monoxide, and dust levels
- **Multi-sensor redundancy** for improved reliability and coverage
- **Smart alerts** for dangerous conditions based on configurable thresholds
- **Weather integration** to provide context for the indoor environment
- **Historical data logging** to track patterns and trends
- **Responsive dashboard** with visualizations and status indicators

## Project Structure

```
home-guardian/
├── backend/              # Node.js server
│   ├── api.js            # API endpoints
│   ├── readings.js       # Reading data handlers
│   ├── safety.js         # Safety calculations
│   ├── server.js         # Main server entry point
│   └── weather.js        # Weather API integration
├── firmware/             # ESP32 code
│   ├── config.h          # System configuration
│   └── firmware.cpp      # Main firmware
└── frontend/             # React dashboard
    ├── components/       # React components
    ├── services/         # API services
    └── styles/           # CSS styles
```

## Hardware Requirements

- KidBright microcontroller
- Temperature & Humidity Sensors (KY-015) x3
- Smoke Gas Sensors (MQ-2) x2
- LPG Gas Sensors (MQ-5) x2
- Carbon Monoxide Sensors (MQ-9) x2
- Dust Sensor (PMS7003) x1

## Software Requirements

### Backend
- Node.js (v14+)
- MongoDB
- Express

### Frontend
- React
- Recharts
- Axios

### Firmware
- Arduino IDE or PlatformIO
- ESP32 board support
- Required libraries: WiFi, HTTPClient, ArduinoJson, DHT

## Installation

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following content:
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/home_guardian
   OPENWEATHER_API_KEY=your_api_key_here
   ```

4. Start the server:
   ```
   npm start
   ```

### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the API URL:
   ```
   REACT_APP_API_URL=http://localhost:3000/api
   ```

4. Start the development server:
   ```
   npm start
   ```

### Firmware

1. Open the Arduino IDE
2. Install the required libraries
3. Copy `credentials.h.template` to `credentials.h` and update with your WiFi details
4. Update `config.h` with your server URL and device settings
5. Upload the firmware to your ESP32

## Usage

1. Once the system is powered on, the ESP32 will connect to WiFi and begin collecting sensor data
2. Data is sent to the server every minute (configurable in `config.h`)
3. Access the dashboard at `http://localhost:3000` to monitor your home environment
4. Alerts will be displayed on the dashboard when dangerous conditions are detected

## API Endpoints

- `POST /api/readings` - Submit sensor readings
- `GET /api/readings/latest` - Get the most recent readings
- `GET /api/readings/history?hours=24` - Get historical readings for a specified time period
- `GET /api/status` - Get current safety status including scores and alerts

## Acknowledgments

- OpenWeatherMap API for weather data
- ESP32 community for libraries and documentation