// /activar-licencia/activacion.js - VERSIÓN FINAL Y GARANTIZADA (V3)

import { db, getCurrentUserId } from "../auth.js"; 
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const licenseInput = document.getElementById('license-input');
const activateButton = document.getElementById('activate-button');
const messageDisplay = document.getElementById('activation-message');

let purchaseId = null;
let userId = null;
let correctKey = null; 

/**
 * Muestra un mensaje al usuario, aplicando las clases CSS de éxito/error.
 */
function displayMessage(message, isError = false) {
    messageDisplay.textContent = message;
    // CRÍTICO: Aseguramos que el mensaje se muestre al cambiar la clase
    messageDisplay.style.display = 'block'; 
    messageDisplay.className = isError ? 'message-error' : 'message-success';
}

/**
 * Función de inicialización: Extrae el ID y carga la clave de licencia de Firebase.
 * CORRECCIÓN: Fuerza la redirección limpia si la licencia ya está activa en Firebase.
 */
async function loadActivationData() {
    // Deshabilitar botón mientras se carga la información
    activateButton.disabled = true;
    displayMessage('Cargando datos de la compra...', false);
    
    // Obtener el ID del usuario
    userId = await getCurrentUserId();
    
    // Obtener purchaseId de la URL (Ej: ?purchaseId=ABC123XYZ)
    const urlParams = new URLSearchParams(window.location.search);
    purchaseId = urlParams.get('purchaseId');

    if (!userId) {
        displayMessage('❌ Por favor, inicia sesión para activar un producto.', true);
        return;
    }
    
    if (!purchaseId) {
        displayMessage('❌ Error: Falta el ID de compra. Vuelve a "Mis Compras".', true);
        return;
    }

    try {
        const purchaseRef = doc(db, "users", userId, "purchases", purchaseId);
        // CRÍTICO: Usamos getDoc, que es la única lectura garantizada de Firebase
        const purchaseSnap = await getDoc(purchaseRef); 

        if (!purchaseSnap.exists()) {
            displayMessage('❌ Error: Compra no encontrada. Vuelve a "Mis Compras".', true);
            return;
        }

        const data = purchaseSnap.data();
        
        if (!data.isLicensed) {
            displayMessage('❌ Este producto no requiere activación por clave.', true);
            return;
        }
        
        correctKey = data.licenseKey; // Clave de licencia cargada

        // ⭐ LÓGICA DE REDIRECCIÓN SI YA ESTÁ ACTIVO (Soluciona el bucle de "ya activada") ⭐
        if (data.isActivated) {
            displayMessage('✅ ¡Esta licencia ya está activa! Redirigiendo a Mis Compras con confirmación...', false);
            
            // Forzamos una redirección limpia para asegurar que mis-compras.js lea el estado final.
            setTimeout(() => {
                // Usamos location.replace y el parámetro 'refreshed' para asegurar la recarga.
                window.location.replace('/mis-compras/mis-compras.html?refreshed=' + Date.now());
            }, 1500); 
            return; // Detiene la ejecución
        }
        
        // Carga exitosa, habilitar y esperar entrada
        displayMessage('¡Listo! Ingresa la clave de licencia que te proporcionamos.', false);
        activateButton.disabled = false;
        
    } catch (error) {
        console.error("Error al cargar datos de activación:", error);
        displayMessage('❌ Error de conexión con el servidor. Intenta de nuevo.', true);
    }
}

/**
 * Maneja la lógica de validación y activación de la licencia.
 * CORRECCIÓN: Incluye actualización agresiva de LocalStorage y espera de 2 segundos.
 */
async function handleActivation() {
    if (activateButton.disabled) return;
    
    const enteredKey = licenseInput.value.trim();

    if (enteredKey === '') {
        displayMessage('Por favor, ingresa tu clave de licencia.', true);
        return;
    }
    
    // Comparamos la clave ingresada con la clave cargada de Firebase (correctKey) 
    if (enteredKey === correctKey) {
        
        activateButton.disabled = true;
        activateButton.textContent = 'Activando...';
        
        try {
            // 1. Actualizar el estado en Firebase (La fuente de verdad)
            const purchaseRef = doc(db, "users", userId, "purchases", purchaseId);

            // CRÍTICO: Esperamos la confirmación de la escritura de Firebase
            await updateDoc(purchaseRef, {
                isActivated: true,
            });
            console.log(`DEBUG: Licencia ${purchaseId} activada en Firebase.`);


            // 2. Corregimos/Actualizamos/Eliminamos la caché LocalStorage (Plan B)
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('purchases_') || key.includes('purchaseHistory')) {
                    let history = JSON.parse(localStorage.getItem(key));
                    
                    let itemIndex = -1;
                    if (history && Array.isArray(history)) {
                         itemIndex = history.findIndex(p => p.id === purchaseId);
                    }
                    
                    if (itemIndex !== -1) {
                         // Actualiza el campo isActivated a TRUE en la caché
                        history[itemIndex].isActivated = true; 
                        localStorage.setItem(key, JSON.stringify(history));
                    } else {
                        // Si no encontramos el item para actualizar, eliminamos el caché para forzar la lectura completa.
                        localStorage.removeItem(key);
                    }
                }
            }


            // 3. Mostrar éxito y REDIRIGIR de forma AGRESIVA
            displayMessage('✅ ¡Licencia activada correctamente! Esperando confirmación...', false);
            
            // ⭐ AUMENTAMOS EL TIEMPO A 2 SEGUNDOS DE ESPERA ⭐
            setTimeout(() => {
                // Utilizamos window.location.replace y el parámetro 'refreshed' para forzar la lectura en mis-compras.js.
                window.location.replace('/mis-compras/mis-compras.html?refreshed=' + Date.now());
                
            }, 2000); // 2 SEGUNDOS DE ESPERA

        } catch (error) {
            console.error("❌ ERROR CRÍTICO: Fallo al actualizar la licencia en Firebase.", error);
            
            // En caso de error de Firebase, limpiamos la caché antes de dar el mensaje de fallo.
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('purchases_') || key.includes('purchaseHistory')) {
                    localStorage.removeItem(key);
                }
            }

            displayMessage('❌ Error al activar la licencia. Intenta de nuevo o contacta a soporte.', true);
            activateButton.disabled = false;
            activateButton.textContent = 'Activar';
        }
    } else {
        displayMessage('❌ Clave de licencia incorrecta. Intenta de nuevo.', true);
    }
}

// Inicializar y agregar listener
document.addEventListener('DOMContentLoaded', () => {
    loadActivationData();
    // Solo agregamos el listener una vez
    activateButton.addEventListener('click', handleActivation);
});