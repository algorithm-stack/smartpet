#include <WiFi.h>
#include <Firebase_ESP_Client.h>

// WiFi
#define WIFI_SSID "A16 de Marysol"
#define WIFI_PASSWORD "123.321ks"

// Firebase
#define API_KEY "AIzaSyBAHdPcQ_WTVmnHFHbA680VTS92UH1wYmk"
#define DATABASE_URL "https://smartpet-unife-default-rtdb.firebaseio.com"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

void setup() {

  Serial.begin(115200);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Conectando WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("WiFi conectado");
  Serial.println(WiFi.localIP());

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  // Sin autenticación de usuario
  auth.user.email = "";
  auth.user.password = "";

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  Serial.println("Firebase iniciado");
}

void loop() {

  if (Firebase.RTDB.getBool(&fbdo, "/alimentar")) {

    bool alimentar = fbdo.boolData();

    if (alimentar) {

      Serial.println("================================");
      Serial.println("ORDEN DE ALIMENTACION RECIBIDA");
      Serial.println("================================");

      Firebase.RTDB.setBool(&fbdo, "/alimentar", false);

      Serial.println("Estado cambiado a FALSE");
    }

  } else {

    Serial.print("Error Firebase: ");
    Serial.println(fbdo.errorReason());

  }

  delay(1000);
}
