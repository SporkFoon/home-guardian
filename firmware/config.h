#ifndef CONFIG_H
#define CONFIG_H

#include "credentials.h"

// Server Settings
const char* SERVER_URL = "http://your-server-ip:3000/api/readings";
const int POST_INTERVAL = 60000;  // Time in milliseconds between data transmissions

// Device Settings
const char* DEVICE_ID = "home_guardian_01";

// Sensor Thresholds
const float TEMP_WARNING_THRESHOLD = 30.0;
const float TEMP_DANGER_THRESHOLD = 40.0;
// Add other thresholds as needed

#endif // CONFIG_H