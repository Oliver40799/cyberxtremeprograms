// =======================================
// 🚀 REGISTRO CYBERXTREME - Estilo Gamer
// =======================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// 🔧 Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDSySrPLsuM3RFbk91uX1Xp-pSoDB4qzas",
  authDomain: "cyberxtreme-1d4be.firebaseapp.com",
  projectId: "cyberxtreme-1d4be",
  storageBucket: "cyberxtreme-1d4be.firebasestorage.app",
  messagingSenderId: "271562035949",
  appId: "1:271562035949:web:2de38841fa165a081732e4",
  measurementId: "G-MVPHTSJ9NV"
};

// 🚀 Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 📋 Referencia al formulario
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const contrasena = document.getElementById("contrasena").value;
  const confirmar = document.getElementById("confirmar_contrasena").value;

  if (contrasena !== confirmar) {
    Swal.fire({
      icon: 'warning',
      title: 'Las contraseñas no coinciden',
      text: 'Revisá que ambas sean iguales',
      confirmButtonColor: '#ff4444',
      background: '#1a1a1a',
      color: '#fff',
      iconColor: '#ffcc00'
    });
    return;
  }

  // Mostrar pantalla de carga mientras crea la cuenta
  Swal.fire({
    title: 'Creando tu cuenta...',
    text: 'Esto puede tardar unos segundos',
    allowOutsideClick: false,
    background: '#121212',
    color: '#fff',
    didOpen: () => {
      Swal.showLoading();
    }
  });

  try {
    // Crear usuario
    const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
    const user = userCredential.user;

    // Guardar nombre del usuario
    await updateProfile(user, { displayName: nombre });

    // Crear documento en Firestore con monedero inicial
    await setDoc(doc(db, "users", user.uid), {
      name: nombre,
      email: correo,
      walletBalance: 0,
      createdAt: serverTimestamp()
    });

    // ✅ Éxito visual
    Swal.fire({
      icon: 'success',
      title: '¡Registro exitoso!',
      html: `<b>${nombre}</b>, tu cuenta ha sido creada con éxito.<br>Bienvenido a <span style="color:#00ff88;">CyberXtreme</span>.`,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      background: '#121212',
      color: '#fff',
      iconColor: '#00ff88'
    }).then(() => {
      window.location.href = "/index.html"; // Redirección
    });

  } catch (error) {
    console.error("Error en el registro:", error);

    let mensaje = "Ocurrió un error inesperado.";
    switch (error.code) {
      case 'auth/email-already-in-use':
        mensaje = "Este correo ya está registrado. Probá iniciar sesión.";
        break;
      case 'auth/invalid-email':
        mensaje = "Correo electrónico inválido.";
        break;
      case 'auth/weak-password':
        mensaje = "La contraseña debe tener al menos 6 caracteres.";
        break;
    }

    Swal.fire({
      icon: 'error',
      title: 'Error en el registro',
      text: mensaje,
      confirmButtonColor: '#ff4444',
      background: '#1a1a1a',
      color: '#fff',
      iconColor: '#ff5555'
    });
  }
});
