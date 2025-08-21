document.addEventListener('DOMContentLoaded', () => {

    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    const paypalForm = document.getElementById('paypal-form');

    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    function renderCart() {
        const cart = getCart();
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
            cartTotalElement.textContent = '$0.00 MXN';
            if (checkoutButton) {
                checkoutButton.style.display = 'none';
            }
            return;
        }

        if (checkoutButton) {
            checkoutButton.style.display = 'block';
        }

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Precio: $${item.price.toFixed(2)} MXN</p>
                    <div class="quantity-controls">
                        <button class="quantity-minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="item-remove" data-id="${item.id}">Eliminar</button>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        cartTotalElement.textContent = `$${total.toFixed(2)} MXN`;
        
        document.querySelectorAll('.item-remove').forEach(button => {
            button.addEventListener('click', removeItem);
        });
        document.querySelectorAll('.quantity-plus').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });
        document.querySelectorAll('.quantity-minus').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });
    }

    function confirmPurchase() {
        const cart = getCart();
        if (cart.length === 0) {
            alert('Tu carrito está vacío. Añade productos para poder comprar.');
            return;
        }

        const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];

        cart.forEach(item => {
            const isLicensedProduct = item.id.startsWith('software');
            const purchaseItem = {
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity,
                purchaseDate: new Date(),
                isLicensed: isLicensedProduct
            };

            if (isLicensedProduct) {
                const licenseKey = Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
                purchaseItem.licenseKey = licenseKey;
                
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 30);
                purchaseItem.expiryDate = expiryDate;
                purchaseItem.isActivated = false; // ¡NUEVO! La licencia no está activada por defecto
            }

            purchaseHistory.push(purchaseItem);
        });

        localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
        localStorage.removeItem('cart');
        renderCart();
        alert('¡Compra realizada con éxito!');
        setTimeout(() => {
            window.location.href = '/mis-compras/mis-compras.html';
        }, 1500);
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
        if (product) {
            product.quantity += 1;
        }
        saveCart(cart);
        renderCart();
    }

    function decreaseQuantity(event) {
        const id = event.target.dataset.id;
        let cart = getCart();
        let product = cart.find(item => item.id === id);
        if (product && product.quantity > 1) {
            product.quantity -= 1;
        } else if (product && product.quantity === 1) {
            cart = cart.filter(item => item.id !== id);
        }
        saveCart(cart);
        renderCart();
    }

    window.addToCart = function(product) {
        let cart = getCart();
        let existingProduct = cart.find(item => item.id === product.id);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            product.quantity = 1;
            cart.push(product);
        }
        saveCart(cart);
        alert('Producto añadido al carrito!');
        if (window.location.pathname.endsWith('carrito.html')) {
            renderCart();
        }
    };
    
    if (window.location.pathname.endsWith('carrito.html')) {
        renderCart();
        
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                confirmPurchase();
            });
        }
    }
});