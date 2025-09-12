document.addEventListener('DOMContentLoaded', () => {

    const productsGrid = document.querySelector('.products-grid');
    const cartCountSpan = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const downloadModal = document.getElementById('download-modal');
    const downloadLink = document.getElementById('download-link');
    const licenseKeySpan = document.getElementById('license-key');
    const reviewsModal = document.getElementById('reviews-modal');
    const reviewsList = document.getElementById('reviews-list');
    const reviewForm = document.getElementById('review-form');

    // Simulación de productos
    const products = [
        { id: 1, name: 'Plantilla de CV Profesional', price: 15.00, image: 'https://via.placeholder.com/400x250/dcdcdc/000?text=CV+Template' },
        { id: 2, name: 'eBook de Finanzas Personales', price: 25.50, image: 'https://via.placeholder.com/400x250/c0c0c0/000?text=eBook' },
        { id: 3, name: 'Pack de Iconos para Apps', price: 40.00, image: 'https://via.placeholder.com/400x250/a0a0a0/000?text=Icon+Pack' }
    ];

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function renderProducts() {
        productsGrid.innerHTML = products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <button class="add-to-cart-btn">Agregar al Carrito</button>
                    <button class="view-reviews-btn">Ver Reseñas</button>
                </div>
            </div>
        `).join('');
    }

    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        cartCountSpan.textContent = cart.length;
        renderCartItems();
    }

    function renderCartItems() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center;">Tu carrito está vacío.</p>';
            cartTotalSpan.textContent = '0.00';
            checkoutBtn.disabled = true;
            return;
        }

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotalSpan.textContent = total.toFixed(2);
        checkoutBtn.disabled = false;

        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="price">$${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-from-cart-btn">Eliminar</button>
            </div>
        `).join('');
    }

    function generateLicenseKey() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let key = '';
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                key += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            if (i < 2) key += '-';
        }
        return `LIC-${key}`;
    }

    // Eventos
    productsGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const card = e.target.closest('.product-card');
            const productId = parseInt(card.dataset.productId);
            const product = products.find(p => p.id === productId);
            if (product) {
                cart.push(product);
                updateCart();
                alert(`"${product.name}" ha sido agregado a tu carrito.`);
            }
        }
        if (e.target.classList.contains('view-reviews-btn')) {
            const card = e.target.closest('.product-card');
            const productId = parseInt(card.dataset.productId);
            // Simulación de carga de reseñas
            renderReviews(productId);
            reviewsModal.style.display = 'flex';
        }
    });

    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-cart-btn')) {
            const itemElement = e.target.closest('.cart-item');
            const productId = parseInt(itemElement.dataset.productId);
            const index = cart.findIndex(item => item.id === productId);
            if (index > -1) {
                cart.splice(index, 1);
                updateCart();
            }
        }
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Tu carrito está vacío.');
            return;
        }
        // Simulación de proceso de pago
        alert('Procesando pago... ¡Compra exitosa!');
        const licenseKey = generateLicenseKey();
        licenseKeySpan.textContent = licenseKey;
        downloadLink.href = 'https://ejemplo.com/download.zip'; // URL de descarga simulada

        downloadModal.style.display = 'flex';
        cart = []; // Limpiar el carrito después de la compra
        updateCart();
    });

    // Navegación entre páginas
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.page-section').forEach(section => {
                section.classList.remove('active');
            });
            const targetId = e.target.dataset.target;
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Lógica para reseñas
    function renderReviews(productId) {
        // Simulación de reseñas de productos
        const sampleReviews = [
            { author: 'Ana G.', text: '¡Excelente producto! Me ayudó mucho.' },
            { author: 'Mario B.', text: 'El mejor eBook de finanzas que he leído.' }
        ];
        reviewsList.innerHTML = sampleReviews.map(review => `
            <div class="review">
                <p><strong>${review.author}:</strong> ${review.text}</p>
            </div>
        `).join('');
    }

    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const reviewText = document.getElementById('review-text').value;
        const newReview = document.createElement('div');
        newReview.className = 'review';
        newReview.innerHTML = `<p><strong>Tú:</strong> ${reviewText}</p>`;
        reviewsList.appendChild(newReview);
        alert('Reseña enviada.');
        reviewForm.reset();
    });

    // Cerrar modales
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });

    // Inicializar la página
    renderProducts();
    updateCart();
});