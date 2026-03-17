// ==============================================
// ♻️ RESTABLECER CONTRASEÑA - CYBERXTREME
// ==============================================

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

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const emailInput = document.getElementById('correo');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email) {
      Swal.fire({
        icon: 'warning',
        title: 'Correo vacío',
        text: 'Por favor, ingresá tu correo electrónico.',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#00b3ff'
      });
      return;
    }

    Swal.fire({
      title: 'Enviando...',
      text: 'Estamos procesando tu solicitud.',
      allowOutsideClick: false,
      background: '#1a1a1a',
      color: '#fff',
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Enviar correo de restablecimiento
    auth.sendPasswordResetEmail(email)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Correo enviado',
          html: `
            Se ha enviado un correo para restablecer tu contraseña.<br>
            Revisá tu bandeja de entrada o carpeta de spam.<br><br>
            <small>🔒 CyberXtreme Security System</small>
          `,
          background: '#0f0f0f',
          color: '#00e1ff',
          confirmButtonColor: '#00b3ff',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });
      })
      .catch((error) => {
        let errorMessage = '';

        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'El formato del correo no es válido.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No hay ningún usuario con ese correo.';
            break;
          default:
            errorMessage = 'Ocurrió un error inesperado. Intentalo más tarde.';
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          background: '#1a1a1a',
          color: '#ff5555',
          confirmButtonColor: '#ff3333',
          showClass: {
            popup: 'animate__animated animate__shakeX'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });

        console.error('Error al enviar correo de restablecimiento:', error);
      });
  });
});
