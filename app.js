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

const savedHistory =
localStorage.getItem("history");

if(savedHistory){
    document.getElementById(
        "historyList"
    ).innerHTML = savedHistory;
}

let today=0;
let week=0;

// Recuperar datos guardados

today = parseInt(localStorage.getItem("today")) || 0;
week = parseInt(localStorage.getItem("week")) || 0;

document.getElementById("todayCount").textContent = today;
document.getElementById("weekCount").textContent = week;

const days=['dom','lun','mar','mie','jue','vie','sab'];

function addDot(dayId){
 document.getElementById(dayId).innerHTML += '<span class="dot">●</span> ';
}

 document.getElementById('feedBtn').addEventListener('click', async ()=>{
 document.getElementById('msg').innerHTML='⏳ Dispensando alimento...';

setTimeout(async ()=>{

  today++;
  week++;

localStorage.setItem("today", today);
localStorage.setItem("week", week);

  document.getElementById('todayCount').textContent=today;
  document.getElementById('weekCount').textContent=week;

  const now=new Date();

  const fecha=now.toLocaleDateString('es-PE',{
    weekday:'long',
    year:'numeric',
    month:'long',
    day:'numeric'
  });

  const hora=now.toLocaleTimeString('es-PE');

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

  document.getElementById('lastFeed').innerHTML='Última alimentación: '+hora;

  const item=document.createElement('div');
  item.className='event';

  item.innerHTML=`
  📅 ${fecha}<br>
  🍽️ Alimentación realizada<br>
  🕒 ${hora}
  `;

  const history=document.getElementById('historyList');

  if(history.innerHTML.includes('No hay registros')){
    history.innerHTML='';
  }

  history.prepend(item);

  localStorage.setItem(
    "history",
    history.innerHTML
);

  addDot(days[now.getDay()]);

  document.getElementById('msg').innerHTML='✅ Mascota alimentada';

 },2000);

});

async function cargarHistorialFirebase(){

  const historial =
  document.getElementById("historyList");

  historial.innerHTML = "";

  const q = query(
    collection(db,"alimentaciones"),
    orderBy("timestamp","desc")
  );

  const snapshot = await getDocs(q);

  snapshot.forEach((doc)=>{

    const data = doc.data();

    const item =
    document.createElement("div");

    item.className = "event";

    item.innerHTML = `
      📅 ${data.fecha}<br>
      🍽️ Alimentación realizada<br>
      🕒 ${data.hora}
    `;

    historial.appendChild(item);

  });

}

cargarHistorialFirebase();