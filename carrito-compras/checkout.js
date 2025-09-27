// ==============================================
// 1. FUNCIONALIDAD DE NOTIFICACIÓN MODAL FLOTANTE
// ==============================================

/**
 * Muestra el modal flotante de notificación.
 * @param {string} type - Clase de estilo ('success', 'error', 'cancel').
 * @param {string} title - Título del modal.
 * @param {string} message - Mensaje de contenido.
 * @param {function} [onAcceptCallback] - Función a ejecutar al presionar 'Aceptar'.
 */
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
// 2. LÓGICA DE PROCESAMIENTO Y PAGO
// ==============================================

const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];

/**
 * Procesa la compra después de la aprobación de PayPal
 */
function processSuccessfulPayment() {
    const cart = getCart();
    let purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];

    cart.forEach(item => {
        const existing = purchaseHistory.find(p => p.id === item.id);
        if (existing) {
            existing.quantity += item.quantity;
            existing.purchaseDate = new Date().toISOString();
        } else {
            purchaseHistory.push({
                ...item,
                downloads: 0,
                purchaseDate: new Date().toISOString(),
                isDigital: true
            });
        }
    });

    localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
    localStorage.removeItem('cart');

    showModal(
        'success', 
        '¡Compra Exitosa!', 
        'Tu pago se ha completado correctamente. Serás redirigido a tus descargas.', 
        () => window.location.href = '/mis-compras/mis-compras.html'
    );
}

/**
 * Configura el botón de PayPal
 */
function setupPayPalButton(total) {
    const container = document.getElementById('paypal-button-container');
    if (!container || total <= 0 || typeof paypal === 'undefined') return;

    paypal.Buttons({
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'checkout' },
        createOrder: (data, actions) => actions.order.create({
            purchase_units: [{ amount: { value: total.toFixed(2), currency_code: 'MXN' } }]
        }),
        onApprove: (data, actions) => actions.order.capture().then(details => {
            if (details.status === "COMPLETED") {
                processSuccessfulPayment();
            } else {
                showModal(
                    'error', 
                    'Pago No Completado', 
                    'No se pudo completar el pago. Verifica tu tarjeta e intenta de nuevo.'
                );
            }
        }),
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
// 3. INICIALIZACIÓN
// ==============================================

document.addEventListener('DOMContentLoaded', () => {
    const orderList = document.getElementById('order-items-list');
    const checkoutTotalElement = document.getElementById('checkout-total');
    const cart = getCart();
    let total = 0;

    if (!cart || cart.length === 0) {
        orderList.innerHTML = '<p style="color: #ff5555;">Tu carrito está vacío. Redirigiendo...</p>';
        checkoutTotalElement.textContent = '$0.00 MXN';
        setTimeout(() => window.location.href = '/carrito-compras/carrito.html', 2000);
        return;
    }

    orderList.innerHTML = '';
    cart.forEach(item => {
        const price = item.price * item.quantity;
        total += price;
        const div = document.createElement('div');
        div.classList.add('order-item');
        div.innerHTML = `<span>${item.name} (${item.quantity}x)</span><span>$${price.toFixed(2)} MXN</span>`;
        orderList.appendChild(div);
    });

    checkoutTotalElement.textContent = `$${total.toFixed(2)} MXN`;
    setupPayPalButton(total);
});
