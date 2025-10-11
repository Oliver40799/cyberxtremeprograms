// /carrito-compras/carrito.js

// ==============================================
// 1. FUNCIONES CENTRALES DE ALMACENAMIENTO (Manteniendo compatibilidad)
// ==============================================

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function getCart() {
    // Las funciones saveCart y getCart permanecen para ser usadas por script.js
    return JSON.parse(localStorage.getItem('cart')) || [];
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
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <div class="item-details-container">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Precio: $${item.price.toFixed(2)} MXN</p>
                    <p>${item.isLicensed ? 'Tipo: Software' : 'Tipo: General'}</p> 
                </div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-minus" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-plus" data-id="${item.id}">+</button>
            </div>
            <button class="item-remove" data-id="${item.id}">Eliminar</button>
        `;
        cartItemsContainer.appendChild(itemElement);
        total += item.price * item.quantity;
    });

    cartTotalElement.textContent = `$${total.toFixed(2)} MXN`;

    document.querySelectorAll('.item-remove').forEach(button => button.addEventListener('click', removeItem));
    document.querySelectorAll('.quantity-plus').forEach(button => button.addEventListener('click', increaseQuantity));
    document.querySelectorAll('.quantity-minus').forEach(button => button.addEventListener('click', decreaseQuantity));
}

function removeItem(event) {
    const id = event.target.dataset.id;
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    renderCart();
}

function increaseQuantity(event) {
    const id = event.target.dataset.id;
    let cart = getCart();
    let product = cart.find(item => item.id === id);
    if (product) product.quantity += 1; 
    saveCart(cart);
    renderCart();
}

function decreaseQuantity(event) {
    const id = event.target.dataset.id;
    let cart = getCart();
    let product = cart.find(item => item.id === id);
    if (product && product.quantity > 1) product.quantity -= 1;
    else if (product && product.quantity === 1) cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    renderCart();
}


// ==============================================
// 3. INICIALIZACIÓN
// ==============================================

document.addEventListener('DOMContentLoaded', () => {
    const checkoutButton = document.getElementById('checkout-button');
    
    if (window.location.pathname.endsWith('carrito.html')) {
        renderCart();
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                // 👉 Redirige a la página de pagos
                window.location.href = '/carrito-compras/checkout.html';
            });
        }
    }
});