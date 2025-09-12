// Tu configuración de Firebase (la que te dio la app)
const firebaseConfig = {
  apiKey: "AIzaSyDSySrPLsuM3RFbk91uX1Xp-pSoDB4qzas",
  authDomain: "cyberxtreme-1d4be.firebaseapp.com",
  projectId: "cyberxtreme-1d4be",
  storageBucket: "cyberxtreme-1d4be.firebasestorage.app",
  messagingSenderId: "271562035949",
  appId: "1:271562035949:web:2de38841fa165a081732e4",
  measurementId: "G-MVPHTSJ9NV"
};

// Inicializa Firebase con la configuración
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', () => {
    // Selecciona el formulario y los elementos de entrada
    const form = document.getElementById('registerForm');
    const emailInput = document.getElementById('correo');

    // Agrega un escuchador de eventos para el envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que la página se recargue

        const email = emailInput.value;

        // Envía el correo de restablecimiento de contraseña a través de Firebase
        auth.sendPasswordResetEmail(email)
            .then(() => {
                // Éxito: el correo ha sido enviado
                alert("Se ha enviado un correo electrónico para restablecer la contraseña. Por favor, revisa tu bandeja de entrada,si no se encuentra el correo revise la bandeja de spam.");
            })
            .catch((error) => {
                // Error: hubo un problema al enviar el correo
                const errorCode = error.code;
                let errorMessage = "";

                if (errorCode === 'auth/invalid-email') {
                    errorMessage = "El formato del correo electrónico no es válido.";
                } else if (errorCode === 'auth/user-not-found') {
                    errorMessage = "No se encontró ningún usuario con ese correo electrónico.";
                } else {
                    errorMessage = "Ocurrió un error inesperado: " + error.message;
                }

                alert(errorMessage);
                console.error("Error al enviar correo de restablecimiento:", error);
            });
    });
});