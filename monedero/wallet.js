// /monedero/wallet.js

// Importamos las referencias a la base de datos (db) y la autenticación (auth)
// Ambas instancias ya están inicializadas en auth.js, lo que simplifica este archivo.
import { db, auth } from "../auth.js"; 

// Importamos las funciones necesarias de Firebase
import { 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { 
    doc, 
    collection, 
    query, 
    orderBy, 
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";


// Elementos del DOM
const balanceElement = document.getElementById('wallet-balance');
const transactionsList = document.getElementById('transactions-list');
const userDisplayId = document.getElementById('user-display-id'); 
const loadingMessage = document.getElementById('loading-message');


// ===================================================
// 1. FUNCIÓN DE RENDERIZADO DE TRANSACCIONES
// ===================================================
function renderTransactions(transactions) {
    transactionsList.innerHTML = ''; // Limpia el contenido antes de renderizar
    
    if (transactions.length === 0) {
        transactionsList.innerHTML = '<p style="color: #ccc;">Aún no tienes movimientos en tu monedero.</p>';
    } else {
        transactions.forEach(tx => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('transaction-item');
            
            // Determinar clase y signo
            const amountClass = tx.movement === 'deposit' ? 'deposit' : 'withdraw';
            const sign = tx.movement === 'deposit' ? '+' : '-';
            
            // Obtener el monto como valor absoluto
            const displayAmount = Math.abs(tx.amount || 0);

            // Formatear la fecha
            const formattedDate = tx.date && tx.date.toDate 
                ? tx.date.toDate().toLocaleDateString('es-MX', { year: 'numeric', month: 'numeric', day: 'numeric' })
                : 'Fecha desconocida';

            itemDiv.innerHTML = `
                <span class="type">${tx.type || 'Transacción'}</span>
                <span class="date">${formattedDate}</span>
                <span class="amount ${amountClass}">${sign} $${displayAmount.toFixed(2)} MXN</span>
            `;
            transactionsList.appendChild(itemDiv);
        });
    }
}


// ===================================================
// 2. ESCUCHAS EN TIEMPO REAL (onSnapshot)
// ===================================================
function setupRealtimeListeners(userId) {
    
    // 1. ESCUCHA DEL SALDO DEL MONEDERO
    const userRef = doc(db, "users", userId);
    onSnapshot(userRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            const balance = userData.walletBalance || 0; 
            
            // Mostrar el saldo real en tiempo real
            balanceElement.textContent = balance.toFixed(2) + ' MXN'; 
        } else {
            balanceElement.textContent = '0.00 MXN';
            console.warn("Documento de usuario no encontrado. Saldo 0.");
        }
    }, (error) => {
        console.error("Error al escuchar el saldo:", error);
    });

    // 2. ESCUCHA DE LAS TRANSACCIONES EN TIEMPO REAL
    const transactionsRef = collection(db, "users", userId, "transactions");
    // NOTA: El orderBy se mantiene, pero recuerda que puede requerir un índice compuesto en Firebase.
    const q = query(transactionsRef, orderBy("date", "desc")); 

    onSnapshot(q, (querySnapshot) => {
        const transactions = [];
        querySnapshot.forEach(doc => {
            transactions.push(doc.data());
        });
        // Renderizar las transacciones cada vez que cambian
        renderTransactions(transactions);
        
    }, (error) => {
        console.error("Error al escuchar transacciones:", error);
    });
}


// ===================================================
// 3. CONTROL DE AUTENTICACIÓN
// ===================================================
document.addEventListener('DOMContentLoaded', () => {
    
    onAuthStateChanged(auth, (user) => {
        if (loadingMessage) loadingMessage.style.display = 'none';

        if (user) {
            // Usuario detectado, inicia las escuchas en tiempo real
            setupRealtimeListeners(user.uid);
            
            // Formateo del ID de Usuario para la Tarjeta Virtual
            const formattedUserId = user.uid.slice(-8);
            userDisplayId.textContent = '**** **** **** ' + formattedUserId; 

        } else {
            // No hay usuario, mostramos mensaje de error y redirigimos a login
            balanceElement.textContent = '0.00 MXN';
            transactionsList.innerHTML = '<p style="color: #FF3838; text-align: center;">Debes iniciar sesión para ver tu monedero.</p>';
            userDisplayId.textContent = '**** **** **** ****';
            
            // Redireccionar al login si no hay sesión
            window.location.href = "/index.html"; 
        }
    });

    // Listeners de botones (mantienen la lógica que ya tenías)
    const btnViewPurchases = document.getElementById('btn-view-purchases');
    const btnUseGuide = document.getElementById('btn-use-guide');
    
    if (btnViewPurchases) {
        btnViewPurchases.addEventListener('click', () => {
            window.location.href = '/mis-compras/mis-compras.html';
        });
    }

    if (btnUseGuide) {
        btnUseGuide.addEventListener('click', () => {
            // NOTA: Deberías usar un modal o un mensaje en el DOM en lugar de alert()
            alert("El saldo del monedero se usará en la página de pago (Checkout). ¡Pronto estará disponible la opción de descuento!");
        });
    }
});
