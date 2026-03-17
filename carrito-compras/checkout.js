// /carrito-compras/checkout.js - VERSIÓN FINAL CON IDEMPOTENCIA Y CORRECCIÓN DE LÍMITE DE DESCARGA (3 -> 1)

// ==============================================
// ⭐ 0. IMPORTACIONES DE FIREBASE Y FUNCIONES ⭐
// ==============================================

// 🔐 Base de datos principal (usuarios, pagos, wallet)
import { db as dbMain, getCurrentUserId } from "../auth.js";

// 🎟️ Base de datos secundaria (licencias y futuras suscripciones)
import { dbLicencias } from "../Administar-Licencias/firebase-licencias.js";


// 📦 Funciones de Firestore
import {
  doc,
  updateDoc,
  increment,
  collection,
  addDoc,
  Timestamp,
  getDoc,
  runTransaction,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// ==============================================
// 1. FUNCIONALIDAD DE NOTIFICACIÓN MODAL FLOTANTE
// ==============================================
function showModal(type, title, message, onAcceptCallback) {
    const modal = document.getElementById('notification-modal');
    const content = modal.querySelector('.modal-content');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const closeButton = document.getElementById('modal-close-button');

    content.className = 'modal-content ' + type; 
    modalTitle.textContent = title;
    modalMessage.textContent = message;

    modal.style.display = 'flex';

    closeButton.onclick = () => {
        modal.style.display = 'none';
        if (onAcceptCallback) onAcceptCallback();
    };
}

// ==============================================
// 2. LÓGICA DE PROCESAMIENTO GENERAL
// ==============================================
const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];

/**
 * Genera un ID Único V4 (UUID) para las licencias y transacciones.
 */
function generateUUID(){
return'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){
var r=Math.random()*16|0,v=c==='x'?r:(r&0x3|0x8)
return v.toString(16)
})
}

function generateOrderCode(){
const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
let code="CXP-"
for(let i=0;i<9;i++){
code+=chars.charAt(Math.floor(Math.random()*chars.length))
}
return code
}

/**
 * Convierte un Timestamp de Firestore a DD/MM/YYYY
 */
function formatTimestamp(timestamp) {
    const date = timestamp.toDate();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}


    // ==============================================
// 🧾 CREAR ORDEN ANTES DEL PAGO
// ==============================================
async function createOrder(userId, cart, total){

  const orderRef = await addDoc(collection(dbMain,"orders"),{
    userId: userId,
    items: cart,
    total: total,
    status: "pending",
    createdAt: Timestamp.now()
  })

  return orderRef.id
}

/**
 * Lógica central de registro de compra y bonificación.
 */
async function recordPurchaseLogic(userId, totalPurchase, paymentMethod, purchaseTransactionId) {
    if (!purchaseTransactionId) {
        throw new Error("Falta el ID de transacción para garantizar la idempotencia.");
    }

    // --------------------------------------------------------------------------------------
    // VERIFICACIÓN DE DUPLICADOS (IDEMPOTENCIA)
    // --------------------------------------------------------------------------------------
    try {
        const purchasesRef = collection(dbMain, "users", userId, "purchases");
        const q = query(purchasesRef, where("purchaseTransactionId", "==", purchaseTransactionId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            console.warn(`Compra con ID ${purchaseTransactionId} ya registrada. Evitando duplicado.`);
            showModal(
                'success', 
                '¡Compra Exitosa (Confirmada)!', 
                'Tu pago ya estaba registrado. Serás redirigido a tus compras.', 
                () => window.location.href = '/mis-compras/mis-compras.html' 
            );
            return; 
        }
    } catch (e) {
        console.error("Error al verificar la idempotencia:", e);
    }

    // --------------------------------------------------------------------------------------
    // BONIFICACIÓN (2%)
    // --------------------------------------------------------------------------------------
    const REWARD_PERCENTAGE = 0.02; 
    const rewardAmount = totalPurchase * REWARD_PERCENTAGE;
    let rewardMessage = '';

    if (rewardAmount > 0) {
        try {
            const userRef = doc(dbMain, "users", userId);
            await updateDoc(userRef, { walletBalance: increment(rewardAmount) });
            
            const transactionsRef = collection(dbMain, "users", userId, "transactions");
            await addDoc(transactionsRef, {
                amount: rewardAmount,
                movement: "deposit", 
                type: "Recompensa por compra", 
                date: Timestamp.now(),
                paymentMethod: paymentMethod
            });
            rewardMessage = ` Además, se han añadido $${rewardAmount.toFixed(2)} MXN a tu monedero como recompensa.`;
        } catch (error) {
            console.error("Error al aplicar la recompensa. Se ignorará y se continuará con la compra.", error);
            rewardMessage = ' Hubo un error al aplicar tu recompensa, pero tu compra principal está siendo registrada.';
        }
    }

    // --------------------------------------------------------------------------------------
    // REGISTRO DE COMPRA PRINCIPAL Y LICENCIAS
    // --------------------------------------------------------------------------------------
    const cart = getCart();
    let localPurchases = JSON.parse(localStorage.getItem(`purchases_${userId}`)) || [];

    try {
        const purchasesRef = collection(dbMain, "users", userId, "purchases");
        const purchaseDateFirebase = Timestamp.now(); 
        const purchaseDateLocal = Date.now(); 
        const orderCode = generateOrderCode()

        for (const item of cart) {
            const itemPrice = parseFloat(item.price);
            const itemQuantity = parseInt(item.quantity);

            if (!item.id || !item.name || isNaN(itemPrice) || isNaN(itemQuantity) || itemPrice <= 0 || itemQuantity <= 0) {
                console.error("Ítem de carrito inválido, saltando:", item);
                continue; 
            }

            const cleanItem = {
                ...item,
                isDigital: !!item.isDigital, 
                isLicensed: !!item.isLicensed,
                category: item.category ? item.category.toLowerCase().trim() : '',
            };

            const isDigital = cleanItem.isDigital; 
            const isLicensed = cleanItem.isLicensed || cleanItem.category.includes('software') || cleanItem.category.includes('licencia');
            
let purchaseItemBase={
productId:(item.id||"unknown_product").toLowerCase(),
productName:item.name||"Producto",
image:item.image||'/default/path/image.jpg',
price:itemPrice,
quantity:itemQuantity,
isDigital:isDigital,
isLicensed:isLicensed,
downloadUrl:item.downloadUrl||null,
paymentMethod:paymentMethod,
purchaseTransactionId:purchaseTransactionId,
orderCode:orderCode
};

            // ===================== NUEVO BLOQUE DE LICENCIAS =====================
            if (isLicensed) {
                for (let i = 0; i < itemQuantity; i++) {
                    const licenseKey = generateUUID();

                    const licenseData = {
                        licenseKey: licenseKey,
                        downloadUrl: item.downloadUrl || `/descargas/software/${item.id.toLowerCase()}.zip`,
                        maxDownloads: 1,
                        downloadsUsed: 0,
                        isActivated: false,
                    };

                    const singleLicensedPurchase = {
                        ...purchaseItemBase,
                        ...licenseData,
                        quantity: 1,
                    };
                    const newPurchaseRef = await addDoc(purchasesRef, {
                        ...singleLicensedPurchase,
                        purchaseDate: purchaseDateFirebase
                    });

                    const licenciasRef = collection(dbLicencias, "licencias");

                    // 🔧 Cálculo correcto de la duración
                    const meses = item.months || 1; // usa la duración real del producto
                    const fechaCreacion = Timestamp.now();
                    const fechaVencimiento = new Date();
                    fechaVencimiento.setMonth(fechaVencimiento.getMonth() + meses);
                    const fechaVencimientoFirebase = Timestamp.fromDate(fechaVencimiento);

await addDoc(licenciasRef,{
producto:item.name || 'Producto desconocido',
precio:item.price || 0,
codigo:licenseKey,

meses: meses,
plan: `${meses} mes${meses>1?"es":""}`, // ⭐ NUEVO

fechaCreacion:fechaCreacion,
fechaVencimiento:fechaVencimientoFirebase,
fechaVencimientoFormateada:formatTimestamp(fechaVencimientoFirebase),

isActivated:false,
isLicensed:true,
userId:userId,
tipo:"software"
});

                    const localItem = { 
                        ...singleLicensedPurchase, 
                        id: newPurchaseRef.id,
                        purchaseDateLocal: purchaseDateLocal, 
                    };
                    localPurchases.push(localItem);
                }
            } else {
                if (isDigital) { 
                    purchaseItemBase.downloadUrl = item.downloadUrl || `/Descargas/digital/${item.id.toLowerCase()}.zip`; 
                    purchaseItemBase.maxDownloads = itemQuantity; 
                    purchaseItemBase.downloadsUsed = 0;
                }
                
                const newPurchaseRef = await addDoc(purchasesRef, {
                    ...purchaseItemBase,
                    purchaseDate: purchaseDateFirebase 
                });
                
                const localItem = { 
                    ...purchaseItemBase, 
                    id: newPurchaseRef.id, 
                    purchaseDateLocal: purchaseDateLocal, 
                };
                localPurchases.push(localItem);
            }
        }

        localStorage.setItem(`purchases_${userId}`, JSON.stringify(localPurchases));
        localStorage.removeItem('cart');

        showModal(
            'success', 
            '¡Compra Exitosa!', 
            'Tu pago se ha completado correctamente.' + rewardMessage + ' Serás redirigido a tus compras.', 
            () => window.location.href = '/mis-compras/mis-compras.html' 
        );

    } catch (error) {
        console.error("FATAL ERROR: Fallo al registrar la compra principal:", error);
        throw new Error('Error al registrar la compra principal: ' + error.message);
    }
}



// ==============================================
// 3. LÓGICA DE PAGO POR MONEDERO (TRANSACCIÓN SEGURA)
// ==============================================

/**
 * Deduce el saldo del monedero usando una transacción atómica y registra la compra.
 */
async function processCyberXPurchase(userId, totalAmount) {
    const finalizeButton = document.getElementById('finalize-cyberx-purchase');
    // ⭐ ID DE TRANSACCIÓN ÚNICO PARA IDEMPOTENCIA (Monedero) ⭐
    const transactionId = generateUUID(); 
    
    try {
        finalizeButton.disabled = true;
        finalizeButton.textContent = "Procesando pago seguro...";

        // Referencia al documento principal del usuario
        const userRef = doc(dbMain, "users", userId); 
        const transactionsRef = collection(dbMain, "users", userId, "transactions"); 
        
        // Bandera para saber si la deducción fue exitosa
        let deductionSuccessful = false;

        // --- INICIA TRANSACCIÓN ATÓMICA DE FIREBASE (SOLO LECTURAS/ESCRITURAS DE SALDO) ---
        await runTransaction(dbMain, async (transaction) => {
            
            const userSnap = await transaction.get(userRef);
            
            let currentBalance = 0;
            if (userSnap.exists() && userSnap.data().walletBalance !== undefined) {
                 currentBalance = userSnap.data().walletBalance || 0;
            }

            if (currentBalance < totalAmount) {
                // Aborta la transacción si no hay fondos.
                throw new Error("Fondos insuficientes en el monedero.");
            }

            const newBalance = currentBalance - totalAmount;

            // 1. DEDUCCIÓN CRÍTICA (ESCRITURA ATÓMICA)
            // Usa transaction.update()
            transaction.update(userRef, { walletBalance: newBalance });

            // 2. REGISTRO DE DÉBITO (ESCRITURA ATÓMICA)
            // Usa transaction.set() con doc(transactionsRef) para generar un ID automático
            transaction.set(doc(transactionsRef), {
                amount: -totalAmount, // Monto negativo para el débito
                movement: "debit", 
                type: "Pago de compra", 
                date: Timestamp.now(), 
                paymentMethod: 'Monedero CyberXtreme',
                // Añadimos el ID para seguimiento en transacciones
                purchaseTransactionId: transactionId
            });
            
            // Si llegamos hasta aquí, la deducción atómica fue exitosa
            deductionSuccessful = true;
        });
        
        // --- FIN DE TRANSACCIÓN ATÓMICA ---

        // ⭐ SOLO SI LA TRANSACCIÓN ATÓMICA FUE EXITOSA, REGISTRAMOS LA COMPRA.
        // LLAMADA CORREGIDA: Pasamos el transactionId
        if (deductionSuccessful) {
            await recordPurchaseLogic(userId, totalAmount, 'Monedero CyberXtreme', transactionId);
        } else {
             throw new Error("Fallo desconocido en la deducción de saldo.");
        }
        
    } catch (e) {
        console.error("Error al procesar la compra con Monedero: ", e);
        
        let errorMessage = e.message.includes("Fondos insuficientes") 
            ? "Fondos insuficientes en el monedero." 
            : `No se pudo completar el pago. Error: ${e.message}`;
        
        showModal('error', "Error de Pago", errorMessage);
        
        finalizeButton.disabled = false;
        finalizeButton.textContent = `Pagar $${totalAmount.toFixed(2)} con Monedero`;
        
        // Recargar el saldo y la UI
        updateWalletDisplay(userId, totalAmount); 
    }
}

// ==============================================
// 4. MANEJO DE LA INTERFAZ DE PAGO
// ==============================================

/**
 * Muestra u oculta los bloques de pago (PayPal o Monedero)
 */
function switchPaymentMethod(method) {
    const paypalContainer = document.getElementById('paypal-button-container');
    const cyberxButton = document.getElementById('finalize-cyberx-purchase');
    
    if (method === 'paypal') {
        paypalContainer.style.display = 'block';
        cyberxButton.style.display = 'none';
        
    } else if (method === 'cyberx') {
        paypalContainer.style.display = 'none';
        cyberxButton.style.display = 'block';
    }
}

/**
 * Obtiene el saldo del usuario y actualiza la UI y el botón de pago con monedero.
 */
async function updateWalletDisplay(userId, total) {
    const balanceDisplay = document.getElementById('wallet-balance-display');
    const finalizeButton = document.getElementById('finalize-cyberx-purchase');
    const label = document.getElementById('cyberx-wallet-option-label');
    const walletErrorMessage = document.getElementById('wallet-error-message'); 
    
    if (!userId) {
        balanceDisplay.textContent = 'Inicia sesión';
        label.style.opacity = 0.6;
        if (walletErrorMessage) walletErrorMessage.style.display = 'none';
        return;
    }

    try {
        const userRef = doc(dbMain, "users", userId); 
        const userSnap = await getDoc(userRef);

        let balance = 0;
        if (userSnap.exists() && userSnap.data().walletBalance !== undefined) {
             balance = userSnap.data().walletBalance || 0;
        }

        const formattedBalance = `$${balance.toFixed(2)} MXN`;
        balanceDisplay.textContent = formattedBalance;
        balanceDisplay.dataset.balance = balance.toFixed(2); 

        if (balance >= total) {
            finalizeButton.disabled = false;
            finalizeButton.textContent = `Pagar $${total.toFixed(2)} con Monedero`;
            label.style.opacity = 1.0;
            if (walletErrorMessage) walletErrorMessage.style.display = 'none';
        } else {
            finalizeButton.disabled = true;
            finalizeButton.textContent = `Saldo insuficiente (Faltan $${(total - balance).toFixed(2)})`;
            label.style.opacity = 0.6;
            if (walletErrorMessage) walletErrorMessage.style.display = 'block'; 
        }
        
    } catch (error) {
        console.error("Error al obtener el saldo:", error);
        balanceDisplay.textContent = 'Error';
        if (walletErrorMessage) walletErrorMessage.style.display = 'none';
    }
}


/**
 * Configura el botón de PayPal
 */
function setupPayPalButton(total, orderId) {

    const container = document.getElementById('paypal-button-container');
    if (!container || total <= 0 || typeof paypal === 'undefined') return;

    container.innerHTML = '';

    paypal.Buttons({

        style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'checkout'
        },

        // Crear orden SOLO cuando el usuario inicia PayPal
        createOrder: async (data, actions) => {

            const userId = await getCurrentUserId();

            if (!userId) {
                showModal(
                    'error',
                    'Error de Sesión',
                    'Debes iniciar sesión para completar la compra.',
                    () => window.location.href = '/INICIOS-REGISTROS/Iniciar-sesion.html'
                );
                return;
            }

            // Crear orden en Firestore solo si aún no existe
            if (!orderId) {
                const cart = getCart();

                const orderRef = await addDoc(collection(dbMain, "orders"), {
                    userId: userId,
                    items: cart,
                    total: total,
                    status: "pending",
                    createdAt: Timestamp.now()
                });

                orderId = orderRef.id;
            }

            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: total.toFixed(2),
                        currency_code: 'MXN'
                    }
                }]
            });
        },

        onApprove: (data, actions) => {

            return getCurrentUserId().then(async (userId) => {

                if (!userId) {
                    showModal(
                        'error',
                        'Error de Sesión',
                        'Debes iniciar sesión para completar la compra.',
                        () => window.location.href = '/INICIOS-REGISTROS/Iniciar-sesion.html'
                    );
                    return;
                }

                try {

                    const details = await actions.order.capture();

                    if (details.status === "COMPLETED") {

                        const transactionId = details.id || generateUUID();

                        // ===============================
                        // VERIFICAR MANIPULACIÓN DE PRECIO
                        // ===============================

                        const paidAmount = parseFloat(details.purchase_units[0].amount.value);

                        if (paidAmount !== total) {

                            await addDoc(collection(dbMain, "security_logs"), {
                                userId: userId,
                                orderId: orderId,
                                type: "payment_mismatch",
                                message: "Monto manipulado en checkout",
                                expected: total,
                                paid: paidAmount,
                                createdAt: Timestamp.now()
                            });

                            throw new Error("Monto alterado detectado");
                        }

                        // ===============================
                        // LOG DE PAYPAL
                        // ===============================

                        await addDoc(collection(dbMain, "paypal_logs"), {
                            orderId: orderId,
                            userId: userId,
                            paymentId: details.id,
                            amount: total,
                            provider: "paypal",
                            status: "completed",
                            payerEmail: details?.payer?.email_address || null,
                            createdAt: Timestamp.now()
                        });

                        // ===============================
                        // MARCAR ORDEN COMO PAGADA
                        // ===============================

                        if (orderId) {
                            await updateDoc(doc(dbMain, "orders", orderId), {
                                status: "paid",
                                paymentProvider: "paypal",
                                paymentId: details.id,
                                paidAt: Timestamp.now()
                            });
                        }

                        // ===============================
                        // REGISTRAR COMPRA
                        // ===============================

                        return recordPurchaseLogic(
                            userId,
                            total,
                            'PayPal',
                            transactionId
                        );

                    } else {

                        showModal(
                            'error',
                            'Pago No Completado',
                            'No se pudo completar el pago. Verifica tu tarjeta e intenta de nuevo.'
                        );

                    }

                } catch (error) {

                    console.error("Error en onApprove:", error);

                    showModal(
                        'error',
                        'Error al procesar el pago',
                        'El pago se realizó pero ocurrió un problema registrando la compra. Contacta soporte.'
                    );

                }

            });

        },

        onCancel: () => {

            showModal(
                'cancel',
                'Pago Cancelado',
                'Has cancelado la transacción.'
            );

        },

        onError: (err) => {

            console.error('Error con PayPal:', err);

            showModal(
                'error',
                'Error de Pago',
                'Ocurrió un error. Revisa tus datos y vuelve a intentar.'
            );

        }

    }).render('#paypal-button-container');

}

// ==============================================
// 5. INICIALIZACIÓN PRINCIPAL
// ==============================================

async function initializeCheckout() {
    const currentUserId = await getCurrentUserId();
    const orderList = document.getElementById('order-items-list');
    const checkoutTotalElement = document.getElementById('checkout-total');
    const cyberxButton = document.getElementById('finalize-cyberx-purchase');
    const cart = getCart();
    let total = 0;
    let orderId = null


    // --- Validación de Carrito ---
    if (!cart || cart.length === 0) {
        if (orderList) orderList.innerHTML = '<p style="color: #ff5555;">Tu carrito está vacío. Redirigiendo...</p>';
        if (checkoutTotalElement) checkoutTotalElement.textContent = '$0.00 MXN';
        setTimeout(() => window.location.href = '/carrito-compras/carrito.html', 2000);
        return;
    }

// --- Renderizado del Resumen de Compra ---
if (orderList) orderList.innerHTML = '';
cart.forEach(item => {
    const months = item.months || 1;
    const unitPrice = item.basePrice || item.price;

    // Total según tipo de producto
    const itemTotal = item.isLicensed ? unitPrice : unitPrice * months * item.quantity;
    total += itemTotal;

    const durationText = item.isLicensed && months > 1 ? `(${months} mes${months > 1 ? 'es' : ''})` : '';

    const div = document.createElement('div');
    div.classList.add('order-item');

    div.innerHTML = `
        <span>${item.name} ${durationText} (${item.quantity}x)</span>
        <span>$${unitPrice.toFixed(2)} MXN</span>
    `;

    if (orderList) orderList.appendChild(div);
});

if (checkoutTotalElement) checkoutTotalElement.textContent = `$${total.toFixed(2)} MXN`;

    
    // --- Configuración de Pagos ---
if (currentUserId) {
    await updateWalletDisplay(currentUserId, total); 
    
    // Configurar botón PayPal
    setupPayPalButton(total, orderId);
    
    // Pago con monedero
cyberxButton.addEventListener('click', async () => {

    if (cyberxButton.disabled) return;

    cyberxButton.disabled = true;
    try {
        if (!orderId) {
            orderId = await createOrder(currentUserId, cart, total);
        }

        await processCyberXPurchase(currentUserId, total);
    } catch (error) {
        console.error("Error en pago con monedero:", error);
    } finally {
        cyberxButton.disabled = false;
    }

});

    // Cambio de método de pago
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            switchPaymentMethod(e.target.value);
            const walletErrorMessage = document.getElementById('wallet-error-message');
            if (walletErrorMessage) walletErrorMessage.style.display = 'none';
        });
    });
    
    // Método de pago por defecto
    switchPaymentMethod('paypal');

} else {

    const paypalContainer = document.getElementById('paypal-button-container');

    if (paypalContainer) {
        paypalContainer.innerHTML = `
        <p style="color:#ffcc00;font-weight:bold;margin-top:20px;">
        Por favor, inicia sesión para acceder a las opciones de pago y completar tu compra.
        </p>`;
    }

    document.getElementById('cyberx-wallet-option-label').style.pointerEvents = 'none';
    document.getElementById('wallet-balance-display').textContent = 'Inicia sesión';

}

}

document.addEventListener('DOMContentLoaded', initializeCheckout);