/* ESP32 HTTP IoT Server Example for Wokwi.com

  https://wokwi.com/projects/320964045035274834

  To test, you need the Wokwi IoT Gateway, as explained here:

  https://docs.wokwi.com/guides/esp32-wifi#the-private-gateway

  Then start the simulation, and open http://localhost:9080
  in another browser tab.

  Note that the IoT Gateway requires a Wokwi Club subscription.
  To purchase a Wokwi Club subscription, go to https://wokwi.com/club
*/

#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <uri/UriBraces.h>
#include <HTTPClient.h>
#include <typeinfo>

#define WIFI_SSID "Wokwi-GUEST"
#define WIFI_PASSWORD ""
// Defining the WiFi channel speeds up the connection:
#define WIFI_CHANNEL 6

WebServer server(80);

const int PINO_DHT = 15;

//Led
const int LED = 2;

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

  //Led
  pinMode(LED, OUTPUT);
}

void loop(void) {  

    String serverName = "https://projeto1-web2.vercel.app/api/obterStatusLuz";
    Serial.println(serverName);
    http.begin(serverName);
    int httpCode = http.GET();
    Serial.println(httpCode);    
    Serial.printf(http.errorToString(httpCode).c_str());
    String payload = "{}"; 
    if (payload>0) {
      payload = http.getString();
      Serial.println(payload);     
      if (payload == "Ligado") {
        //Led 1
        digitalWrite(LED, HIGH);
      }
    }

    http.end();
  }

  delay(5000);
}
