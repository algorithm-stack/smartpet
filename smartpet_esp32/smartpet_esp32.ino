#include <WiFi.h>

const char* ssid = "A16 de Marysol";
const char* password = "123.321ks";

void setup() {

  Serial.begin(115200);

  WiFi.begin(ssid, password);

  Serial.print("Conectando");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.println(WiFi.localIP());

  Serial.println("ESP32 listo para Firebase");
}

void loop() {

}
