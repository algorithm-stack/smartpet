#include <WiFi.h>
#include <FirebaseESP32.h>

#define WIFI_SSID "A16 de Marysol"
#define WIFI_PASSWORD "123.321ks"

#define FIREBASE_HOST "smartpet-unife-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH ""

FirebaseData firebaseData;

void setup() {

  Serial.begin(115200);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Conectando WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.println(WiFi.localIP());

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

  Serial.println("Firebase iniciado");
}

void loop() {

  if (Firebase.getBool(firebaseData, "/alimentar")) {

    bool alimentar = firebaseData.boolData();

    if (alimentar == true) {

      Serial.println("================================");
      Serial.println("ORDEN DE ALIMENTACION RECIBIDA");
      Serial.println("================================");

      Firebase.setBool(firebaseData, "/alimentar", false);

      Serial.println("Estado cambiado a FALSE");
    }
  }
  else {

    Serial.print("Error Firebase: ");
    Serial.println(firebaseData.errorReason());
  }

  delay(1000);
}
