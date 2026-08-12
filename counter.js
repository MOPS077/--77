// counter.js — счётчик посещений сайта «Дело Пал Лаич»
// ВАЖНО: вставь сюда свой firebaseConfig (см. инструкцию ниже) прежде чем заливать на сайт.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore, doc, setDoc, updateDoc, increment,
  collection, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// 1) ЗАМЕНИ ЭТОТ ОБЪЕКТ на свой из Firebase Console (Project settings → Your apps → Web app)
const firebaseConfig = {
  apiKey: "AIzaSyC5rualFmXZ1OBvoHhqPv5X63nwE056AfM",
    authDomain: "pal-laich.firebaseapp.com",
    projectId: "pal-laich",
    storageBucket: "pal-laich.firebasestorage.app",
    messagingSenderId: "1097966266281",
    appId: "1:1097966266281:web:1f095ff3c50be95c4146b8",
    measurementId: "G-DDSN6818D0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Название текущей страницы (для разбивки по фрагментам в админке)
const pageName = document.title || location.pathname.split("/").pop() || "unknown";

async function logVisit() {
  try {
    // общий счётчик
    const totalRef = doc(db, "stats", "total");
    await setDoc(totalRef, { count: increment(1) }, { merge: true });

    // счётчик по конкретной странице
    const pageRef = doc(db, "stats_by_page", pageName);
    await setDoc(pageRef, { count: increment(1), page: pageName }, { merge: true });

    // лог отдельного визита (для списка "последние посещения" в админке)
    await addDoc(collection(db, "visits"), {
      page: pageName,
      time: serverTimestamp(),
      ref: document.referrer || null,
      lang: navigator.language || null
    });
  } catch (e) {
    console.warn("Счётчик посещений не сработал:", e);
  }
}

logVisit();
