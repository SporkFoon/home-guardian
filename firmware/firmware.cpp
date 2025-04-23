/*
 * Home Guardian - Main Firmware
 * 
 * This firmware collects data from multiple sensors and sends it to a server
 * for monitoring home safety conditions including temperature, humidity,
 * smoke/gas levels, and air quality.
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <Wire.h>
#include "config.h"  // Include separate configuration file
// If using WiFiManager instead of credentials.h, comment out config.h and uncomment the line below
// #include "wifi_manager.h"  // Include WiFi Manager for captive portal configuration

// Pin Definitions
#define DHT_PIN1 16
#define DHT_PIN2 17
#define DHT_PIN3 18
#define MQ2_PIN1 32  // Smoke sensor
#define MQ2_PIN2 33  // Smoke sensor
#define MQ5_PIN1 34  // LPG sensor
#define MQ5_PIN2 35  // LPG sensor
#define MQ9_PIN1 36  // CO sensor
#define MQ9_PIN2 39  // CO sensor
// PMS7003 uses Serial2 for communication

// Initialize sensor objects
DHT dht1(DHT_PIN1, DHT22);
DHT dht2(DHT_PIN2, DHT22);
DHT dht3(DHT_PIN3, DHT22);

// Variables for connection status
bool wifiConnected = false;
unsigned long lastSendTime = 0;
int failedUploads = 0;

// Function prototypes
bool connectToWiFi();
float readTemperature(DHT &sensor, int sensorNum);
float readHumidity(DHT &sensor, int sensorNum);
int readGasSensor(int pin);
bool sendData(JsonDocument& doc);
void blinkLED(int times);

void setup() {
  // Initialize serial communication
  Serial.begin(115200);
  Serial.println("\n\n===== Home Guardian System Starting =====");
  
  // Initialize onboard LED
  pinMode(LED_BUILTIN, OUTPUT);
  
  // Initialize sensors
  Serial.println("Initializing sensors...");
  dht1.begin();
  dht2.begin();
  dht3.begin();
  
  // For PMS7003 dust sensor
  Serial2.begin(9600);
  
  // Connect to WiFi
  connectToWiFi();
  
  Serial.println("Setup complete!");
  blinkLED(3); // Signal setup complete
}

void loop() {
  unsigned long currentTime = millis();
  
  // Check WiFi connection
  if (!wifiConnected || WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi connection lost, reconnecting...");
    wifiConnected = connectToWiFi();
    if (!wifiConnected) {
      delay(5000);  // Wait before trying again
      return;
    }
  }
  
  // Check if it's time to send data
  if (currentTime - lastSendTime >= POST_INTERVAL) {
    Serial.println("Reading sensors and sending data...");
    
    // Create JSON document for sensor data
    StaticJsonDocument<1024> doc;
    
    // Device identifier
    doc["device_id"] = DEVICE_ID;
    
    // Read temperature & humidity sensors
    doc["temp1"] = readTemperature(dht1, 1);
    doc["humidity1"] = readHumidity(dht1, 1);
    doc["temp2"] = readTemperature(dht2, 2);
    doc["humidity2"] = readHumidity(dht2, 2);
    doc["temp3"] = readTemperature(dht3, 3);
    doc["humidity3"] = readHumidity(dht3, 3);
    
    // Read gas sensors
    doc["smoke1"] = readGasSensor(MQ2_PIN1);
    doc["smoke2"] = readGasSensor(MQ2_PIN2);
    doc["lpg1"] = readGasSensor(MQ5_PIN1);
    doc["lpg2"] = readGasSensor(MQ5_PIN2);
    doc["co1"] = readGasSensor(MQ9_PIN1);
    doc["co2"] = readGasSensor(MQ9_PIN2);
    
    // Read dust sensor (PMS7003)
    // This would require specific implementation for the PMS7003 sensor
    // doc["dust"] = readDustSensor();
    
    // Add timestamp (milliseconds since boot)
    doc["timestamp"] = currentTime;
    
    // Send data to server
    bool success = sendData(doc);
    
    if (success) {
      failedUploads = 0;
      lastSendTime = currentTime;
      blinkLED(1); // Signal successful upload
    } else {
      failedUploads++;
      
      if (failedUploads > 5) {
        // After 5 failed attempts, try reconnecting to WiFi
        Serial.println("Multiple upload failures, reconnecting WiFi...");
        WiFi.disconnect();
        delay(1000);
        wifiConnected = connectToWiFi();
        failedUploads = 0;
      } else {
        // Try again sooner than the regular interval
        lastSendTime = currentTime - (POST_INTERVAL / 2);
      }
      
      blinkLED(2); // Signal upload failure
    }
  }
  
  // Short delay to prevent hogging the CPU
  delay(1000);
}

// Connect to WiFi network
bool connectToWiFi() {
  Serial.print("Connecting to WiFi network: ");
  Serial.println(WIFI_SSID);
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  // Wait for connection with timeout
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    return true;
  } else {
    Serial.println("\nFailed to connect to WiFi!");
    return false;
  }
}

// Read temperature from DHT sensor with error handling
float readTemperature(DHT &sensor, int sensorNum) {
  float temp = sensor.readTemperature();
  if (isnan(temp)) {
    Serial.print("Failed to read temperature from sensor ");
    Serial.println(sensorNum);
    return 0;
  }
  Serial.print("Temperature ");
  Serial.print(sensorNum);
  Serial.print(": ");
  Serial.println(temp);
  return temp;
}

// Read humidity from DHT sensor with error handling
float readHumidity(DHT &sensor, int sensorNum) {
  float humidity = sensor.readHumidity();
  if (isnan(humidity)) {
    Serial.print("Failed to read humidity from sensor ");
    Serial.println(sensorNum);
    return 0;
  }
  Serial.print("Humidity ");
  Serial.print(sensorNum);
  Serial.print(": ");
  Serial.println(humidity);
  return humidity;
}

// Read analog gas sensor
int readGasSensor(int pin) {
  int reading = analogRead(pin);
  Serial.print("Gas sensor on pin ");
  Serial.print(pin);
  Serial.print(": ");
  Serial.println(reading);
  return reading;
}

// Send data to server
bool sendData(JsonDocument& doc) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected!");
    return false;
  }
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");
  
  Serial.print("Sending data to server: ");
  Serial.println(jsonString);
  
  int httpResponseCode = http.POST(jsonString);
  
  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    
    String response = http.getString();
    Serial.println("Server response: " + response);
    
    http.end();
    return (httpResponseCode == 200 || httpResponseCode == 201);
  } else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
    http.end();
    return false;
  }
}

// Blink LED for visual feedback
void blinkLED(int times) {
  for (int i = 0; i < times; i++) {
    digitalWrite(LED_BUILTIN, HIGH);
    delay(200);
    digitalWrite(LED_BUILTIN, LOW);
    delay(200);
  }
}