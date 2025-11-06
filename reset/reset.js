// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDSySrPLsuM3RFbk91uX1Xp-pSoDB4qzas",
  authDomain: "cyberxtreme-1d4be.firebaseapp.com",
  projectId: "cyberxtreme-1d4be",
  storageBucket: "cyberxtreme-1d4be.firebasestorage.app",
  messagingSenderId: "271562035949",
  appId: "1:271562035949:web:2de38841fa165a081732e4",
  measurementId: "G-MVPHTSJ9NV"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const params = new URLSearchParams(window.location.search);
const oobCode = params.get('oobCode');

const btnReset = document.getElementById('btnReset');
const mensaje = document.getElementById('mensaje');

btnReset.addEventListener('click', () => {
  const nuevaContrasena = document.getElementById('nuevaContrasena').value;

  if (!nuevaContrasena) {
    mostrarMensaje("Por favor, ingresá una nueva contraseña.", "error");
    return;
  }

  auth.confirmPasswordReset(oobCode, nuevaContrasena)
    .then(() => {
      mostrarMensaje("✅ Contraseña actualizada correctamente. Redirigiendo...", "exito");
      setTimeout(() => {
        window.location.href = "/INICIOS-REGISTROS/Iniciar-sesion.html";
      }, 2000);
    })
    .catch((error) => {
      console.error(error);
      let msg = "Ocurrió un error.";
      if (error.code === 'auth/expired-action-code') msg = "El enlace ha expirado.";
      else if (error.code === 'auth/invalid-action-code') msg = "El enlace no es válido.";
      mostrarMensaje("❌ " + msg, "error");
    });
});

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.classList.add('visible');
  mensaje.style.color = tipo === "exito" ? "#00eaff" : "#ff5555";
}


