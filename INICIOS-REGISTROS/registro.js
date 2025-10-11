// registro.js

// Importa solo las funciones que necesitas
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Referencia al formulario
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const contrasena = document.getElementById("contrasena").value;
    const confirmar = document.getElementById("confirmar_contrasena").value;

    // NOTA: Recomiendo usar un mensaje en el DOM en lugar de alert()
    if (contrasena !== confirmar) {
        alert("Las contraseñas no coinciden"); 
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
        const user = userCredential.user;

        await updateProfile(user, { displayName: nombre });

        // ⭐ LÓGICA CLAVE: CREACIÓN DEL MONEDERO POR DEFECTO PARA EL NUEVO USUARIO
        await setDoc(doc(db, "users", user.uid), {
            name: nombre,
            email: correo,
            walletBalance: 0, // ⭐ El saldo inicial de monedero para CUALQUIER usuario
            createdAt: serverTimestamp() 
        });

        // NOTA: Recomiendo usar un mensaje en el DOM en lugar de alert()
        alert("Registro exitoso. Disfruta de tu experiencia en CyberXtreme!");
        
        // Redirigir al dashboard principal después del registro
        window.location.href = "/index.html"; 

    } catch (error) {
        // En lugar de alert, podrías mostrar un modal o un mensaje en el DOM
        alert("Error en el registro: " + error.message); 
        console.error("Error en el registro:", error);
    }
});