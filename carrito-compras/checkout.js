// /carrito-compras/checkout.js - VERSIÓN FINAL CON IDEMPOTENCIA Y CORRECCIÓN DE LÍMITE DE DESCARGA (3 -> 1)

// ==============================================
// ⭐ 0. IMPORTACIONES DE FIREBASE Y FUNCIONES ⭐
// ==============================================
import { db, getCurrentUserId } from "../auth.js"; 
import { 
    doc, 
    updateDoc, 
    increment, 
    collection, 
    addDoc, 
    Timestamp, 
    getDoc, 
    runTransaction, 
    query,       // <- Nueva Importación para Idempotencia
    where,       // <- Nueva Importación para Idempotencia
    getDocs,     // <- Nueva Importación para Idempotencia
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
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Lógica central de registro de compra y bonificación. 
 * ESTA FUNCIÓN AHORA INCLUYE LÓGICA DE IDEMPOTENCIA.
 * @param {string} userId - ID del usuario actual.
 * @param {number} totalPurchase - Monto total de la compra.
 * @param {string} paymentMethod - Método de pago ('PayPal' o 'Monedero CyberXtreme').
 * @param {string} purchaseTransactionId - ID único de la transacción para evitar duplicados (Idempotencia).
 */
async function recordPurchaseLogic(userId, totalPurchase, paymentMethod, purchaseTransactionId) {
    
    // 🛑 VALIDACIÓN DE IDEMPOTENCIA CRÍTICA:
    if (!purchaseTransactionId) {
        throw new Error("Falta el ID de transacción para garantizar la idempotencia.");
    }

    // --------------------------------------------------------------------------------------
    // LÓGICA DE VERIFICACIÓN DE DUPLICADOS (IDEMPOTENCIA)
    // --------------------------------------------------------------------------------------
    try {
        const purchasesRef = collection(db, "users", userId, "purchases");
        // Buscamos si ya existe una compra con este ID de transacción
        const q = query(purchasesRef, where("purchaseTransactionId", "==", purchaseTransactionId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            console.warn(`ADVERTENCIA: Compra con ID ${purchaseTransactionId} ya registrada. Evitando duplicado.`);
            // Si ya existe, asumimos que el pago fue exitoso y redirigimos.
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
        // Si falla la lectura, continuamos, pero el riesgo de duplicado persiste.
    }


    // --------------------------------------------------------------------------------------
    // LÓGICA DE RECOMPENSA (Bonificación del 2%)
    // --------------------------------------------------------------------------------------
    const REWARD_PERCENTAGE = 0.02; 
    const rewardAmount = totalPurchase * REWARD_PERCENTAGE;
    let rewardMessage = '';

    if (rewardAmount > 0) {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { walletBalance: increment(rewardAmount) });
            
            const transactionsRef = collection(db, "users", userId, "transactions");
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
    // LÓGICA DE REGISTRO DE COMPRA PRINCIPAL (USANDO IDEMPOTENCIA)
    // --------------------------------------------------------------------------------------
    const cart = getCart(); // Aseguramos que el carrito esté fresco
    let localPurchases = JSON.parse(localStorage.getItem(`purchases_${userId}`)) || [];

    try {
        const purchasesRef = collection(db, "users", userId, "purchases");
        const purchaseDateFirebase = Timestamp.now(); 
        const purchaseDateLocal = Date.now(); 

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
            
            let purchaseItemBase = {
                // ⭐ CORRECCIÓN CLAVE: ESTANDARIZAR A MINÚSCULAS para que coincida con descargas.js ⭐
                productId: item.id.toLowerCase(),
                productName: item.name,
                image: item.image || '/default/path/image.jpg',
                price: itemPrice, 
                quantity: itemQuantity,
                isDigital: isDigital,
                isLicensed: isLicensed,
                downloadUrl: item.downloadUrl || null,
                paymentMethod: paymentMethod,
                // ⭐ CRÍTICO: CAMPO DE IDEMPOTENCIA AÑADIDO ⭐
                purchaseTransactionId: purchaseTransactionId 
            };
            
            if (isLicensed) {
                for (let i = 0; i < itemQuantity; i++) {
                    
                    const licenseData = {
                        licenseKey: generateUUID(), 
                        // También se estandariza el ID aquí, por si se usa en la URL de descarga
                        downloadUrl: item.downloadUrl || `/descargas/software/${item.id.toLowerCase()}.zip`, 
                        maxDownloads: 1, // ✅ CORRECCIÓN APLICADA: Ahora es 1 (una descarga/instalación por licencia comprada)
                        downloadsUsed: 0,
                        isActivated: false, // Aseguramos el estado inicial para la activación
                    };

                    const singleLicensedPurchase = {
                        ...purchaseItemBase,
                        ...licenseData,
                        quantity: 1, 
                    };
                    
                    // Registrar la compra en Firebase (addDoc)
                    const newPurchaseRef = await addDoc(purchasesRef, {
                        ...singleLicensedPurchase,
                        purchaseDate: purchaseDateFirebase 
                    });
                    
                    const localItem = { 
                        ...singleLicensedPurchase, 
                        // Es vital guardar el ID de Firebase para usarlo en 'mis-compras.js' y 'activacion.js'
                        id: newPurchaseRef.id, 
                        purchaseDateLocal: purchaseDateLocal, 
                    };
                    localPurchases.push(localItem);
                }
                
            } else {
                // Lógica para productos no licenciados/digitales
                if (isDigital) { 
                    // Se usa el ID en minúsculas para la URL de descarga
                    purchaseItemBase.downloadUrl = item.downloadUrl || `/Descargas/digital/${item.id.toLowerCase()}.zip`; 
                    // ⭐ CORRECCIÓN CLAVE: Usamos la cantidad comprada como límite ⭐
                    purchaseItemBase.maxDownloads = itemQuantity; 
                    purchaseItemBase.downloadsUsed = 0;
                }
                
                // Registrar la compra en Firebase (addDoc)
                const newPurchaseRef = await addDoc(purchasesRef, {
                    ...purchaseItemBase,
                    purchaseDate: purchaseDateFirebase 
                });
                
                const localItem = { 
                    ...purchaseItemBase, 
                    // Es vital guardar el ID de Firebase para usarlo en 'mis-compras.js' y 'activacion.js'
                    id: newPurchaseRef.id, 
                    purchaseDateLocal: purchaseDateLocal, 
                };
                localPurchases.push(localItem);
            }
        }
        
        // Guardar el historial local con IDs en minúsculas
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
        // Volvemos a lanzar el error para que sea capturado por el llamador (PayPal o Monedero)
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
        const userRef = doc(db, "users", userId); 
        const transactionsRef = collection(db, "users", userId, "transactions"); 
        
        // Bandera para saber si la deducción fue exitosa
        let deductionSuccessful = false;

        // --- INICIA TRANSACCIÓN ATÓMICA DE FIREBASE (SOLO LECTURAS/ESCRITURAS DE SALDO) ---
        await runTransaction(db, async (transaction) => {
            
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
        const userRef = doc(db, "users", userId); 
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
function setupPayPalButton(total) {
    const container = document.getElementById('paypal-button-container');
    if (!container || total <= 0 || typeof paypal === 'undefined') return;

    container.innerHTML = ''; 

    paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'checkout' },
        createOrder: (data, actions) => actions.order.create({
            purchase_units: [{ amount: { value: total.toFixed(2), currency_code: 'MXN' } }]
        }),
        onApprove: (data, actions) => {
            // OBTENEMOS EL USER ID AQUÍ DE MANERA ASÍNCRONA
            return getCurrentUserId().then(userId => {
                if (!userId) {
                    showModal('error', 'Error de Sesión', 'Debes iniciar sesión para completar la compra.', () => window.location.href = '/INICIOS-REGISTROS/Iniciar-sesion.html');
                    return;
                }
                
                return actions.order.capture().then(details => {
                    if (details.status === "COMPLETED") {
                        // ⭐ ID DE TRANSACCIÓN PARA IDEMPOTENCIA (PayPal) ⭐
                        // Usamos el ID de la orden de PayPal para la idempotencia
                        const transactionId = details.id || generateUUID(); 
                        
                        // Si PayPal aprueba, llamamos a la lógica de registro
                        // LLAMADA CORREGIDA: Pasamos el transactionId
                        return recordPurchaseLogic(userId, total, 'PayPal', transactionId).catch(error => {
                            console.error("Error al registrar la compra (capturado por onApprove):", error);
                            showModal('error', 'Error Grave de Registro', 'El pago se procesó, pero falló la función final de registro. Contacta a soporte.');
                        });
                    } else {
                        showModal('error', 'Pago No Completado', 'No se pudo completar el pago. Verifica tu tarjeta e intenta de nuevo.');
                    }
                });
            }); // Cierre del then(userId => { ... })
        },
        onCancel: () => {
            showModal('cancel', 'Pago Cancelado', 'Has cancelado la transacción.');
        },
        onError: (err) => {
            console.error('Error con PayPal:', err);
            showModal('error', 'Error de Pago', 'Ocurrió un error. Revisa tus datos y vuelve a intentar.');
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
        const price = item.price * item.quantity;
        total += price;
        const div = document.createElement('div');
        div.classList.add('order-item');
        div.innerHTML = `<span>${item.name} (${item.quantity}x)</span><span>$${price.toFixed(2)} MXN</span>`;
        if (orderList) orderList.appendChild(div);
    });

    if (checkoutTotalElement) checkoutTotalElement.textContent = `$${total.toFixed(2)} MXN`;
    
    // --- Configuración de Pagos ---
    if (currentUserId) {
        await updateWalletDisplay(currentUserId, total); 
        
        setupPayPalButton(total);
        
        cyberxButton.addEventListener('click', () => {
            processCyberXPurchase(currentUserId, total);
        });

        document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                switchPaymentMethod(e.target.value);
                const walletErrorMessage = document.getElementById('wallet-error-message');
                if (walletErrorMessage) walletErrorMessage.style.display = 'none';
            });
        });
        
        switchPaymentMethod('paypal');

    } else {
        const paypalContainer = document.getElementById('paypal-button-container');
        if (paypalContainer) {
            paypalContainer.innerHTML = '<p style="color: #ffcc00; font-weight: bold; margin-top: 20px;">Por favor, inicia sesión para acceder a las opciones de pago y completar tu compra.</p>';
        }
        document.getElementById('cyberx-wallet-option-label').style.pointerEvents = 'none';
        document.getElementById('wallet-balance-display').textContent = 'Inicia sesión';
    }
}


document.addEventListener('DOMContentLoaded', initializeCheckout);