import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import { getFirestore} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBAHdPcQ_WTVmnHFHbA680VTS92UH1wYmk",
  authDomain: "smartpet-unife.firebaseapp.com",
  projectId: "smartpet-unife",
  storageBucket: "smartpet-unife.firebasestorage.app",
  messagingSenderId: "100036422246",
  appId: "1:100036422246:web:dc2641976eb5845f1bdba7"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
