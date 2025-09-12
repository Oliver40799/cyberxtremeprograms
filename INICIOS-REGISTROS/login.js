// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDSySrPLsuM3RFbk91uX1Xp-pSoDB4qzas",
    authDomain: "cyberxtreme-1d4be.firebaseapp.com",
    projectId: "cyberxtreme-1d4be",
    storageBucket: "cyberxtreme-1d4be.firebasestorage.app",
    messagingSenderId: "271562035949",
    appId: "1:271562035949:web:2de38841fa165a081732e4",
    measurementId: "G-MVPHTSJ9NV"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Capturar el formulario
const loginForm = document.getElementById('registerForm');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const correo = document.getElementById('correo').value;
  const contrasena = document.getElementById('contrasena').value;

  auth.signInWithEmailAndPassword(correo, contrasena)
    .then((userCredential) => {
      // Inicio de sesión exitoso
      alert("Sesión iniciada correctamente");
      window.location.href = "/index.html"; // Cambia esto al archivo que quieras abrir después
    })
    .catch((error) => {
      const errorCode = error.code;

      if (errorCode === 'auth/user-not-found') {
        alert("Usuario no encontrado");
      } else if (errorCode === 'auth/wrong-password') {
        alert("Contraseña incorrecta");
      } else if (errorCode === 'auth/invalid-email') {
        alert("Correo no válido");
      } else {
        alert("Error: " + error.message);
      }
    });
});
