document.addEventListener('DOMContentLoaded', () => {

    // Páginas y elementos principales
    const homePage = document.getElementById('home-page');
    const suscripcionPage = document.getElementById('suscripcion-page');
    const mapaPage = document.getElementById('mapa-page');
    const cartPage = document.getElementById('cart-page');
    const navLinks = document.querySelectorAll('.nav-link');
    const productsGrid = document.getElementById('products-grid');
    const cartCountSpan = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalSpan = document.getElementById('cart-total');

    // Simulación de "base de datos"
    const productos = [
        { id: 1, name: 'Manzanas Orgánicas', price: 2.50, image: 'https://via.placeholder.com/300x250/8FBC8F/fff?text=Manzanas', nutri: '100g: 52 kcal, 14g Carbs' },
        { id: 2, name: 'Zanahorias de la Granja', price: 1.80, image: 'https://via.placeholder.com/300x250/D2B48C/fff?text=Zanahorias', nutri: '100g: 41 kcal, 10g Carbs' },
        { id: 3, name: 'Huevos de Campo (docena)', price: 4.00, image: 'https://via.placeholder.com/300x250/F5F5DC/333?text=Huevos', nutri: 'Unidad: 78 kcal, 6.3g Proteínas' },
        { id: 4, name: 'Tomates Cherry', price: 3.20, image: 'https://via.placeholder.com/300x250/6B8E23/fff?text=Tomates', nutri: '100g: 18 kcal, 4g Carbs' }
    ];

    const granjas = [
        { name: 'Granja El Roble', lat: 19.4519, lng: -99.2081 },
        { name: 'Huerto de la Sierra', lat: 19.4079, lng: -99.1246 },
        { name: 'Finca Los Girasoles', lat: 19.4623, lng: -99.0917 }
    ];

    const cestaSemanal = { id: 5, name: 'Cesta Semanal de Productos', price: 35.00, image: 'https://via.placeholder.com/300x250/8FBC8F/fff?text=Cesta+Semanal', nutri: 'Varía según el contenido' };

    let cart = JSON.parse(localStorage.getItem('organicos_cart')) || [];

    // Funciones de navegación
    function showPage(pageId) {
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(pageId).classList.remove('hidden');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.closest('a').dataset.page;
            showPage(`${page}-page`);
        });
    });

    // Lógica del catálogo y carrito
    function renderProducts() {
        productsGrid.innerHTML = productos.map(prod => `
            <div class="product-card">
                <img src="${prod.image}" alt="${prod.name}">
                <div class="product-info">
                    <h3>${prod.name}</h3>
                    <p class="price">$${prod.price.toFixed(2)}</p>
                    <p class="nutri-info">Información Nutricional: ${prod.nutri}</p>
                    <button class="cta-btn add-to-cart-btn" data-id="${prod.id}"><i class="fa-solid fa-cart-plus"></i> Añadir</button>
                </div>
            </div>
        `).join('');
    }

    function updateCart() {
        localStorage.setItem('organicos_cart', JSON.stringify(cart));
        cartCountSpan.textContent = cart.length;
        renderCartItems();
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center;">El carrito está vacío.</p>';
            cartTotalSpan.textContent = '0.00';
            return;
        }

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotalSpan.textContent = total.toFixed(2);

        cart.forEach((item, index) => {
            const cartItemEl = document.createElement('div');
            cartItemEl.classList.add('cart-item');
            cartItemEl.innerHTML = `
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}">
                    <h4>${item.name}</h4>
                </div>
                <p class="price">$${item.price.toFixed(2)}</p>
                <button class="remove-btn" data-index="${index}">Eliminar</button>
            `;
            cartItemsContainer.appendChild(cartItemEl);
        });
    }

    productsGrid.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart-btn')) {
            const productId = parseInt(e.target.closest('button').dataset.id);
            const product = productos.find(p => p.id === productId);
            cart.push(product);
            updateCart();
            alert(`"${product.name}" añadido a la cesta.`);
        }
    });

    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.closest('.remove-btn')) {
            const index = parseInt(e.target.closest('.remove-btn').dataset.index);
            cart.splice(index, 1);
            updateCart();
        }
    });

    document.getElementById('subscribe-btn').addEventListener('click', () => {
        cart.push(cestaSemanal);
        updateCart();
        alert('¡Te has suscrito a la Cesta Semanal! Se ha añadido a tu carrito.');
        showPage('cart-page');
    });

    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('El carrito está vacío.');
            return;
        }
        console.log('Finalizar compra:', cart);
        alert('¡Gracias por tu compra! Tu pedido ha sido procesado.');
        cart = [];
        updateCart();
        showPage('home-page');
    });

    // Inicializar
    renderProducts();
    updateCart();
});