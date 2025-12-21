// =======================================
// 🔐 LOGIN CYBERXTREME - Versión con Google y Microsoft (CORREGIDO)
// =======================================

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

// Capturar elementos de la UI
const loginForm = document.getElementById('registerForm');
const btnGoogleSignIn = document.getElementById('btnGoogleSignIn');
const btnMicrosoftSignIn = document.getElementById('btnMicrosoftSignIn');

// ====================================================
// 🔑 FUNCIÓN VER/OCULTAR CONTRASEÑA (NUEVO CÓDIGO)
// ====================================================

const passwordInput = document.getElementById('contrasena');
const togglePasswordButton = document.getElementById('togglePassword');

if (togglePasswordButton && passwordInput) {
    togglePasswordButton.addEventListener('click', function () {
        // 1. Determinar el tipo de input actual
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        
        // 2. Cambiar el tipo de input
        passwordInput.setAttribute('type', type);
        
        // 3. Cambiar el ícono (alternar entre ojo abierto y ojo tachado)
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });
}


// ----------------------------------------------------
// 1. INICIO DE SESIÓN TRADICIONAL (CORREO Y CONTRASEÑA)
// ----------------------------------------------------
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;

    Swal.fire({
        title: 'Iniciando sesión...',
        text: 'Por favor esperá unos segundos',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
        background: '#121212',
        color: '#fff'
    });

    auth.signInWithEmailAndPassword(correo, contrasena)
        .then(() => {
            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido a CyberXtreme!',
                text: 'Sesión iniciada correctamente',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                background: '#121212',
                color: '#fff',
                iconColor: '#00ff88'
            }).then(() => {
                window.location.href = "/index.html";
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            let mensaje = "Ocurrió un error al iniciar sesión.";

            switch (errorCode) {
                case 'auth/user-not-found':
                    mensaje = "No existe una cuenta con ese correo.";
                    break;
                case 'auth/wrong-password':
                    mensaje = "Contraseña incorrecta. Intentá de nuevo.";
                    break;
                case 'auth/invalid-email':
                    mensaje = "Correo inválido. Verificá que esté bien escrito.";
                    break;
                default:
                    mensaje = error.message; 
                    break;
            }

            Swal.fire({
                icon: 'error',
                title: 'Error al iniciar sesión',
                text: mensaje,
                confirmButtonColor: '#ff4444',
                background: '#1a1a1a',
                color: '#fff',
                iconColor: '#ff5555'
            });
        });
});

// ----------------------------------------------------
// 2. INICIO DE SESIÓN CON GOOGLE
// ----------------------------------------------------
btnGoogleSignIn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    Swal.fire({
        title: 'Abriendo Google...',
        text: 'Te redirigiremos para iniciar sesión.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
        background: '#121212',
        color: '#fff'
    });

    auth.signInWithPopup(provider)
        .then((result) => {
            Swal.close(); 
            const user = result.user;

            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido a CyberXtreme!',
                text: `Sesión iniciada correctamente con Google (${user.displayName}).`,
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                background: '#121212',
                color: '#fff',
                iconColor: '#00ff88'
            }).then(() => {
                window.location.href = "/index.html";
            });
        })
        .catch((error) => {
            Swal.close();
            let mensaje = "Error al conectar con Google.";
            
            if (error.code === 'auth/popup-closed-by-user') {
                mensaje = 'El proceso de Google fue cancelado por el usuario.';
            } else if (error.code === 'auth/account-exists-with-different-credential') {
                mensaje = 'Ya existe una cuenta registrada con este correo usando otro método.';
            } else {
                mensaje = `Error de Google Auth: ${error.message}`; 
            }

            Swal.fire({
                icon: 'error',
                title: 'Error de Autenticación',
                text: mensaje,
                confirmButtonColor: '#ff4444',
                background: '#1a1a1a',
                color: '#fff',
                iconColor: '#ff5555'
            });
            console.error(error);
        });
});


// ----------------------------------------------------
// 3. INICIO DE SESIÓN CON MICROSOFT (AZURE/PERSONAL)
// ----------------------------------------------------
btnMicrosoftSignIn.addEventListener('click', () => {
    // CORRECCIÓN: Usamos OAuthProvider con el ID del dominio ('microsoft.com') 
    // en lugar de MicrosoftAuthProvider para asegurar la compatibilidad con el SDK.
    const provider = new firebase.auth.OAuthProvider('microsoft.com');
    
    Swal.fire({
        title: 'Abriendo Microsoft...',
        text: 'Te redirigiremos para iniciar sesión.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
        background: '#121212',
        color: '#fff'
    });

    auth.signInWithPopup(provider)
        .then((result) => {
            Swal.close();
            const user = result.user;

            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido a CyberXtreme!',
                text: `Sesión iniciada correctamente con Microsoft (${user.displayName}).`,
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                background: '#121212',
                color: '#fff',
                iconColor: '#00ff88'
            }).then(() => {
                window.location.href = "/index.html";
            });
        })
        .catch((error) => {
            Swal.close();
            let mensaje = "Error al conectar con Microsoft.";
            
            if (error.code === 'auth/popup-closed-by-user') {
                mensaje = 'El proceso de Microsoft fue cancelado por el usuario.';
            } else if (error.code === 'auth/unauthorized-domain') {
                mensaje = 'Error de Dominio No Autorizado. Verifica tu lista de dominios en la consola de Firebase.';
            } else {
                mensaje = `Error de Microsoft Auth: ${error.message}`;
            }

            Swal.fire({
                icon: 'error',
                title: 'Error de Autenticación',
                text: mensaje,
                confirmButtonColor: '#ff4444',
                background: '#1a1a1a',
                color: '#fff',
                iconColor: '#ff5555'
            });
            console.error(error);
        });
});