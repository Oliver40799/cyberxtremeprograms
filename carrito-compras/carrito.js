// ==============================================
// 1. FUNCIONES CENTRALES DE ALMACENAMIENTO
// ==============================================

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// 🛡️ Carrito seguro
function getCart() {

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (!Array.isArray(cart)) return [];

    cart = cart.filter(item => {

        if (!item) return false;

        if (typeof item.id !== "string") return false;
        if (typeof item.name !== "string") return false;

        if (typeof item.price !== "number" && typeof item.basePrice !== "number") return false;

        if (typeof item.quantity !== "number") return false;

        if (item.quantity <= 0 || item.quantity > 10) return false;

        if ((item.price && item.price < 0) || (item.basePrice && item.basePrice < 0)) return false;

        return true;
    });

    return cart;
}

// ==============================================
// 2. LÓGICA DE VISTA DEL CARRITO
// ==============================================

function renderCart() {

    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');

    const cart = getCart();

    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {

        cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        cartTotalElement.textContent = '$0.00 MXN';

        if (checkoutButton) checkoutButton.style.display = 'none';

        return;
    }

    if (checkoutButton) checkoutButton.style.display = 'block';

    cart.forEach(item => {

        const months = item.months || 1;

        // 🛡️ Sanitizar precio
        const unitPrice = Math.max(0, item.basePrice || item.price || 0);

        // 🛡️ Sanitizar cantidad
        const quantity = Math.max(1, Math.min(item.quantity, 10));

        const itemTotal = unitPrice * quantity;

        total += itemTotal;

        const durationText = months > 1 ? `(${months} meses)` : `(1 mes)`;

        const safeImage = item.image || "/Imagenes/default-product.jpg";

        const safeName = item.name.replace(/</g, "").replace(/>/g, "");

        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');

        itemElement.innerHTML = `
        <div class="item-details-container">
        <img src="${safeImage}" alt="${safeName}">
        <div class="item-details">
        <h3>${safeName}</h3>
        <p>Precio: $${unitPrice.toFixed(2)} MXN ${item.isLicensed ? durationText : ''}</p>
        <p>${item.isLicensed ? 'Tipo: Software' : 'Tipo: General'}</p>
        </div>
        </div>

        <div class="quantity-controls">
        <button class="quantity-minus" data-id="${item.id}" data-months="${months}">-</button>
        <span>${quantity}</span>
        <button class="quantity-plus" data-id="${item.id}" data-months="${months}">+</button>
        </div>

        <button class="item-remove" data-id="${item.id}" data-months="${months}">
        Eliminar
        </button>
        `;

        cartItemsContainer.appendChild(itemElement);
    });

    cartTotalElement.textContent = `$${total.toFixed(2)} MXN`;

    document.querySelectorAll('.item-remove').forEach(button => button.addEventListener('click', removeItem));
    document.querySelectorAll('.quantity-plus').forEach(button => button.addEventListener('click', increaseQuantity));
    document.querySelectorAll('.quantity-minus').forEach(button => button.addEventListener('click', decreaseQuantity));
}

// ==============================================
// 3. FUNCIONES DE MODIFICACIÓN DE CARRITO
// ==============================================

function removeItem(event) {

    const id = event.target.dataset.id;
    const months = parseInt(event.target.dataset.months || '1');

    let cart = getCart();

    cart = cart.filter(item => !(item.id === id && (item.months || 1) === months));

    saveCart(cart);

    renderCart();
}

function increaseQuantity(event) {

    const id = event.target.dataset.id;
    const months = parseInt(event.target.dataset.months || '1');

    let cart = getCart();

    const item = cart.find(i => i.id === id && (i.months || 1) === months);

    if (item && item.quantity < 10) {
        item.quantity += 1;
    }

    saveCart(cart);

    renderCart();
}

function decreaseQuantity(event) {

    const id = event.target.dataset.id;
    const months = parseInt(event.target.dataset.months || '1');

    let cart = getCart();

    const item = cart.find(i => i.id === id && (i.months || 1) === months);

    if (item) {

        if (item.quantity > 1) {

            item.quantity -= 1;

        } else {

            cart = cart.filter(i => !(i.id === id && (i.months || 1) === months));
        }
    }

    saveCart(cart);

    renderCart();
}

// ==============================================
// 4. INICIALIZACIÓN
// ==============================================

document.addEventListener('DOMContentLoaded', () => {

    const checkoutButton = document.getElementById('checkout-button');

    if (window.location.pathname.endsWith('carrito.html')) {

        renderCart();

        if (checkoutButton) {

            checkoutButton.addEventListener('click', () => {

                window.location.href = '/carrito-compras/checkout.html';

            });
        }
    }
});