// ===============================================
// 🔐 CONFIGURACIÓN SEGURA DE FIREBASE (LICENCIAS)
// ===============================================

// Importar funciones necesarias
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// 🔧 Configuración del nuevo proyecto Firebase (para licencias)
const firebaseConfig = {
  apiKey: "AIzaSyAkeTYnuYHcCBkUiymB9i095Njivn96Lds",
  authDomain: "cyberxtreme-programs.firebaseapp.com",
  projectId: "cyberxtreme-programs",
  storageBucket: "cyberxtreme-programs.firebasestorage.app",
  messagingSenderId: "686726697781",
  appId: "1:686726697781:web:db6b33e069a1352b30327c",
  measurementId: "G-3B7R3M3BLL"
};

// 🚀 Inicializar la app (con nombre único)
const appLicencias = initializeApp(firebaseConfig, "appLicencias");

// 🔹 Exportar la base de datos para usar en otros archivos
export const dbLicencias = getFirestore(appLicencias);
