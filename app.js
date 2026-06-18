import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc
}
from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

let today = 0;
let week = 0;

document.getElementById("todayCount").textContent = 0;
document.getElementById("weekCount").textContent = 0;

const days = ['dom','lun','mar','mie','jue','vie','sab'];

function addDot(dayId){
  document.getElementById(dayId).innerHTML +=
  '<span class="dot">●</span> ';
}

document.getElementById('feedBtn').addEventListener('click', async ()=>{

  document.getElementById('msg').innerHTML =
  '⏳ Dispensando alimento...';

  setTimeout(async ()=>{

    const now = new Date();

    const fecha = now.toLocaleDateString('es-PE',{
      weekday:'long',
      year:'numeric',
      month:'long',
      day:'numeric'
    });

    const hora = now.toLocaleTimeString('es-PE');

    await addDoc(
      collection(db, "alimentaciones"),
      {
        fecha: fecha,
        hora: hora,
        timestamp: Date.now()
      }
    );

    await updateDoc(
      doc(db, "control", "dispensador"),
      {
        alimentar: true
      }
    );

    document.getElementById('lastFeed').innerHTML =
    'Última alimentación: ' + hora;

    document.getElementById('msg').innerHTML =
    '✅ Mascota alimentada';

    cargarHistorialFirebase();

  },2000);

});

async function cargarHistorialFirebase(){

  today = 0;
  week = 0;

  const historial =
  document.getElementById("historyList");

  historial.innerHTML = "";

  document.getElementById("lun").innerHTML = "";
  document.getElementById("mar").innerHTML = "";
  document.getElementById("mie").innerHTML = "";
  document.getElementById("jue").innerHTML = "";
  document.getElementById("vie").innerHTML = "";
  document.getElementById("sab").innerHTML = "";
  document.getElementById("dom").innerHTML = "";

  const ahora = new Date();

  const inicioHoy = new Date(
    ahora.getFullYear(),
    ahora.getMonth(),
    ahora.getDate()
  ).getTime();

  const inicioSemana =
    inicioHoy - (6 * 24 * 60 * 60 * 1000);

  const q = query(
    collection(db,"alimentaciones"),
    orderBy("timestamp","desc")
  );

  const snapshot = await getDocs(q);

  snapshot.forEach((docFirebase)=>{

    const data = docFirebase.data();

    if(data.timestamp >= inicioHoy){
      today++;
    }

    if(data.timestamp >= inicioSemana){
      week++;
    }

    const item =
    document.createElement("div");

    item.className = "event";

    item.innerHTML = `
      📅 ${data.fecha}<br>
      🍽️ Alimentación realizada<br>
      🕒 ${data.hora}
    `;

    historial.appendChild(item);

    const fechaTexto =
    data.fecha.toLowerCase();

    if(fechaTexto.includes("lunes")){
      addDot("lun");
    }
    else if(fechaTexto.includes("martes")){
      addDot("mar");
    }
    else if(
      fechaTexto.includes("miércoles") ||
      fechaTexto.includes("miercoles")
    ){
      addDot("mie");
    }
    else if(fechaTexto.includes("jueves")){
      addDot("jue");
    }
    else if(fechaTexto.includes("viernes")){
      addDot("vie");
    }
    else if(
      fechaTexto.includes("sábado") ||
      fechaTexto.includes("sabado")
    ){
      addDot("sab");
    }
    else if(fechaTexto.includes("domingo")){
      addDot("dom");
    }

  });

  document.getElementById("todayCount").textContent =
  today;

  document.getElementById("weekCount").textContent =
  week;

}

cargarHistorialFirebase();
