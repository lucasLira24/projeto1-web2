#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <uri/UriBraces.h>
#include "DHTesp.h"
#include <HTTPClient.h>

#define WIFI_SSID "Wokwi-GUEST"
#define WIFI_PASSWORD ""
// Defining the WiFi channel speeds up the connection:
#define WIFI_CHANNEL 6

WebServer server(80);

const int PINO_DHT = 15;

String temperatura = "0";
String umidade = "0";

DHTesp sensorDHT;

void setup(void) {
  Serial.begin(115200);
  //Config Sensor
  sensorDHT.setup(PINO_DHT, DHTesp::DHT22);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD, WIFI_CHANNEL);
  Serial.print("Connecting to WiFi ");
  Serial.print(WIFI_SSID);
  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.print(".");
  }
  Serial.println(" Connected!");

  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  server.begin();
  Serial.println("HTTP server started");
}

void loop(void) {  
  TempAndHumidity dados = sensorDHT.getTempAndHumidity();
  temperatura = String(dados.temperature, 2);
  Serial.println(temperatura);
  umidade = String(dados.humidity, 1);

  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    String serverName = "https://projeto1-web2.vercel.app/api/temperatura?temp=";
    serverName.concat(temperatura);

    Serial.println(serverName);
    http.begin(serverName);
    int httpCode = http.GET();
    Serial.println(httpCode);    
    Serial.printf(http.errorToString(httpCode).c_str());
    String payload = "{}"; 
    if (httpCode>0) {
      payload = http.getString();
    }
    Serial.println(payload);
    http.end();
  }

  delay(5000);
}