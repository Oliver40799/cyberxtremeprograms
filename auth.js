// Importa las funciones de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
    const authButtonsContainer = document.getElementById("auth-buttons"); // Contenedor botones login/register
    const userProfileContainer = document.getElementById("user-profile"); // Contenedor perfil usuario
    const userMenuButton = document.getElementById("user-name-button");   // Botón con nombre
    const fullNameDisplay = document.getElementById("full-name-display"); // Texto nombre/email
    const userDropdownMenu = document.getElementById("user-dropdown-menu"); // Menú desplegable
    const logoutButton = document.getElementById("logout-button"); // Botón cerrar sesión

    // Toggle menú desplegable al hacer click en el nombre
    if (userMenuButton) {
        userMenuButton.addEventListener("click", (e) => {
            e.stopPropagation();
            if (userDropdownMenu) {
                userDropdownMenu.style.display =
                    userDropdownMenu.style.display === "block" ? "none" : "block";
            }
        });
    }

    // Cierra menú si se hace click afuera
    window.addEventListener("click", () => {
        if (userDropdownMenu && userDropdownMenu.style.display === "block") {
            userDropdownMenu.style.display = "none";
        }
    });

    // Detectar cambios de autenticación
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Usuario logueado
            if (authButtonsContainer) authButtonsContainer.style.display = "none";
            if (userProfileContainer) userProfileContainer.style.display = "block";

            // Mostrar nombre si lo tiene, si no su email
            if (fullNameDisplay) {
                fullNameDisplay.textContent = user.displayName
                    ? user.displayName
                    : user.email;
            }
        } else {
            // Usuario deslogueado
            if (authButtonsContainer) authButtonsContainer.style.display = "block";
            if (userProfileContainer) userProfileContainer.style.display = "none";
        }
    });

    // Cerrar sesión
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            signOut(auth)
                .then(() => {
                    console.log("Sesión cerrada correctamente.");
                    window.location.href = "/Index.html";
                })
                .catch((error) => {
                    console.error("Error al cerrar sesión:", error);
                });
        });
    }
});
