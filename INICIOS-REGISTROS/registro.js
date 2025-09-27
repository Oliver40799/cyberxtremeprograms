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

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const contrasena = document.getElementById("contrasena").value;
  const confirmar_contrasena = document.getElementById("confirmar_contrasena").value;

  if (contrasena !== confirmar_contrasena) {
    alert("Las contraseñas no coinciden");
    return;
  }

  auth.createUserWithEmailAndPassword(correo, contrasena)
    .then(userCredential => {
      return userCredential.user.updateProfile({ displayName: nombre });
    })
    .then(() => {
      alert("Registro exitoso! Ya puedes iniciar sesión.");
      registerForm.reset();
     window.location.href = "/index.html";  // o la página principal que tengas

    })
    .catch(error => {
      alert("Error: " + error.message);
    });
});
