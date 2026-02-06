// auth.js - Manejo de Autenticación y Firestore (v9.6.1 - Versión compatible con tu entorno)
// ** CRÍTICO: Usar esta versión de Firebase en todos los archivos del navegador **

// Importa las funciones de Firebase (v9.6.1)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut, 
    createUserWithEmailAndPassword, // Añadido para registro
    signInWithEmailAndPassword      // Añadido para inicio de sesión
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc,
    Timestamp,
    setLogLevel
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";


// =================================================================
// 1. CONFIGURACIÓN E INICIALIZACIÓN GLOBAL (Versión Explícita)
// =================================================================

// Tu configuración de Firebase - MANTENIDA EXPLÍCITAMENTE para evitar problemas de sesión
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
export const auth = getAuth(app); 

// Inicialización de Firestore
export const db = getFirestore(app); 
// Activar el registro de depuración para ver errores de Firestore en consola
// setLogLevel('debug'); // Desactivado temporalmente para no saturar la consola


// =================================================================
// 2. LÓGICA DE INICIALIZACIÓN DE MONEDERO
// =================================================================

/**
 * Crea o verifica el documento del usuario en Firestore.
 * Esto inicializa el saldo del monedero a 0 si es un usuario nuevo.
 * @param {object} user - El objeto User de Firebase Auth.
 */
async function initializeUserDocument(user) {
    // Definimos la referencia al documento del usuario
    const userRef = doc(db, "users", user.uid);
    
    try {
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
            console.log(`Creando documento inicial para el usuario: ${user.uid}`);
            
            // Creamos un nuevo documento con los datos esenciales, incluyendo walletBalance
            await setDoc(userRef, {
                userId: user.uid, // Añadido para redundancia/consultas
                email: user.email || "",
                name: user.displayName || "Usuario CyberX",
                walletBalance: 0, // CRÍTICO: Inicializar el saldo a 0
                createdAt: new Date().toISOString(), // Usamos ISOString para compatibilidad con Firestore v9
            }, { merge: true }); // Usamos merge para evitar sobrescribir si el documento existe con otra data
        }
    } catch (error) {
        console.error("ERROR CRÍTICO de Firestore: No se pudo inicializar el documento del usuario.", error);
    }
}


// =================================================================
// 3. LÓGICA DE AUTENTICACIÓN (Exportables)
// =================================================================

/**
 * Registra un nuevo usuario con email y contraseña, e inicializa su monedero.
 */
export async function registerUser(email, password, name = "") {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Al registrar, creamos inmediatamente el documento
    await initializeUserDocument(user); 
    
    return user;
}

/**
 * Inicia sesión con email y contraseña, y verifica/crea su monedero.
 */
export async function loginUser(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Al iniciar sesión, verificamos/creamos el documento
    await initializeUserDocument(user); 
    
    return user;
}


/**
 * Cierra la sesión del usuario.
 */
export async function logoutUser() {
    await signOut(auth);
}

/**
 * Obtiene el ID del usuario actual de forma asíncrona (versión simplificada para v9).
 */
export const getCurrentUserId = () => {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe(); 
            resolve(user ? user.uid : null); 
        });
    });
};


// 3.2. Listener de Estado de Autenticación para la UI (Exportable)

export const setupAuthListener = (callback) => {
    return onAuthStateChanged(auth, (user) => {
        if (user) {
            // ⭐ CRÍTICO: Inicializar el documento del usuario en Firebase ⭐
            initializeUserDocument(user);
            callback(user);
        } else {
            callback(null);
        }
    });
};

// =================================================================
// 4. LÓGICA DE ACTUALIZACIÓN DE INTERFAZ (UI) Y MANEJO DE MENÚS
// =================================================================

// Detección de cambios de autenticación para la INTERFAZ (UI)
onAuthStateChanged(auth, (user) => {
    const authButtonsContainer = document.getElementById("auth-buttons");
    const userProfileContainer = document.getElementById("user-profile");
    const fullNameDisplay = document.getElementById("full-name-display");
    // Nota: El botón de cerrar sesión se configura en DOMContentLoaded para manejar el evento click

    const updateUI = () => {
        if (user) {
            // Usuario logueado: Ocultar botones, mostrar perfil
            if (authButtonsContainer) authButtonsContainer.style.display = "none";
            if (userProfileContainer) userProfileContainer.style.display = "block";
            
            // Mostrar el nombre/email del usuario
            if (fullNameDisplay) {
                // Si el usuario tiene nombre, lo usa. Si no, usa el email.
                fullNameDisplay.textContent = user.displayName ? user.displayName : user.email;
            }

        } else {
            // Usuario deslogueado: Mostrar botones, ocultar perfil
            if (authButtonsContainer) authButtonsContainer.style.display = "block";
            if (userProfileContainer) userProfileContainer.style.display = "none";
        }
    };

    // Asegurarse de que el DOM esté cargado antes de manipular la UI
    if (document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", updateUI);
    } else {
        updateUI();
    }
});


// LÓGICA DE MANEJO DE MENÚS Y BOTONES (RE-AÑADIDA)
document.addEventListener("DOMContentLoaded", () => {
    const userMenuButton = document.getElementById("user-name-button"); // Es el botón o elemento que contiene el nombre
    const userDropdownMenu = document.getElementById("user-dropdown-menu"); // Es el menú flotante
    const logoutButton = document.getElementById("logout-button");

    // 1. Toggle menú desplegable
    if (userMenuButton && userDropdownMenu) {
        userMenuButton.addEventListener("click", (e) => {
            e.stopPropagation(); // Evita que el click se propague a la ventana
            userDropdownMenu.style.display =
                userDropdownMenu.style.display === "block" ? "none" : "block";
        });
    }

    // 2. Cierra menú si se hace click en cualquier otro lado de la ventana
    window.addEventListener("click", () => {
        if (userDropdownMenu && userDropdownMenu.style.display === "block") {
            userDropdownMenu.style.display = "none";
        }
    });

    // 3. Cerrar sesión
    if (logoutButton) {
        logoutButton.addEventListener("click", async () => {
            try {
                await logoutUser();
                console.log("Sesión cerrada correctamente.");
                // Opcional: Redirigir a la página principal después de cerrar sesión
                // window.location.href = "/Index.html";
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
            }
        });
    }
});
