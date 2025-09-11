document.addEventListener('DOMContentLoaded', () => {

    // Páginas y elementos principales
    const homePage = document.getElementById('home-page');
    const productDetailPage = document.getElementById('product-detail-page');
    const cartPage = document.getElementById('cart-page');
    const navLinks = document.querySelectorAll('.nav-link');
    const flowerGrid = document.getElementById('flower-grid');
    const cartCountSpan = document.getElementById('cart-count');

    // Elementos de la página de producto
    const productImage = document.getElementById('product-image');
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const productDescription = document.getElementById('product-description');
    const dedicationTextarea = document.getElementById('dedication-text');
    const addToCartBtn = document.getElementById('add-to-cart-btn');

    // Elementos del carrito y checkout
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSubtotalSpan = document.getElementById('cart-subtotal');
    const deliveryCostSpan = document.getElementById('delivery-cost');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutForm = document.getElementById('checkout-form');

    // Simulación de "base de datos"
    const arreglos = [
        { id: 1, name: 'Ramo Primaveral', price: 45.00, image: 'https://via.placeholder.com/400x450/e6d6d1/5a4a42?text=Ramo+Primaveral', description: 'Una selección de flores frescas de temporada para alegrar cualquier día.' },
        { id: 2, name: 'Bouquet de Rosas Clásicas', price: 60.00, image: 'https://via.placeholder.com/400x450/5a4a42/e6d6d1?text=Bouquet+de+Rosas', description: 'Elegante ramo de 12 rosas rojas, perfecto para expresar amor y pasión.' },
        { id: 3, name: 'Arreglo Silvestre', price: 35.00, image: 'https://via.placeholder.com/400x450/c0a068/f8f4f2?text=Arreglo+Silvestre', description: 'Una mezcla de flores silvestres y follaje, con un toque rústico y natural.' },
        { id: 4, name: 'Caja de Flores Exóticas', price: 75.00, image: 'https://via.placeholder.com/400x450/333/fff?text=Flores+Exoticas', description: 'Impresionante arreglo de flores exóticas en una elegante caja de regalo.' }
    ];

    const DELIVERY_COST = 5.00;
    let cart = JSON.parse(localStorage.getItem('floreria_cart')) || [];
    let currentProduct = null;

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

    // Lógica del catálogo y detalles de producto
    function renderCatalog() {
        flowerGrid.innerHTML = arreglos.map(arreglo => `
            <div class="flower-card" data-id="${arreglo.id}">
                <img src="${arreglo.image}" alt="${arreglo.name}">
                <div class="flower-info">
                    <h3>${arreglo.name}</h3>
                    <p class="price">$${arreglo.price.toFixed(2)}</p>
                    <button class="cta-btn view-details-btn">Ver Detalles</button>
                </div>
            </div>
        `).join('');
    }

    flowerGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.flower-card');
        if (!card) return;
        const arregloId = parseInt(card.dataset.id);
        const arreglo = arreglos.find(a => a.id === arregloId);
        
        // Cargar detalles y mostrar la página
        currentProduct = arreglo;
        productImage.src = arreglo.image;
        productImage.alt = arreglo.name;
        productName.textContent = arreglo.name;
        productDescription.textContent = arreglo.description;
        productPrice.textContent = `$${arreglo.price.toFixed(2)}`;
        dedicationTextarea.value = ''; // Limpiar dedicatoria
        
        showPage('product-detail-page');
    });

    // Lógica del Carrito y Envío
    function updateCart() {
        localStorage.setItem('floreria_cart', JSON.stringify(cart));
        cartCountSpan.textContent = cart.length;
        renderCartItems();
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--light-text-color);">El carrito está vacío.</p>';
            cartSubtotalSpan.textContent = '0.00';
            deliveryCostSpan.textContent = '0.00';
            cartTotalSpan.textContent = '0.00';
            return;
        }

        const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
        const total = subtotal + DELIVERY_COST;
        
        cartSubtotalSpan.textContent = subtotal.toFixed(2);
        deliveryCostSpan.textContent = DELIVERY_COST.toFixed(2);
        cartTotalSpan.textContent = total.toFixed(2);

        cart.forEach((item, index) => {
            const cartItemEl = document.createElement('div');
            cartItemEl.classList.add('cart-item');
            cartItemEl.innerHTML = `
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="price">$${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <button class="remove-btn" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
            `;
            cartItemsContainer.appendChild(cartItemEl);
        });
    }

    addToCartBtn.addEventListener('click', () => {
        if (!currentProduct) return;
        
        const item = { ...currentProduct, dedication: dedicationTextarea.value };
        cart.push(item);
        updateCart();
        alert(`"${item.name}" se añadió al carrito.`);
        showPage('home-page');
    });

    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.closest('.remove-btn')) {
            const index = parseInt(e.target.closest('.remove-btn').dataset.index);
            cart.splice(index, 1);
            updateCart();
        }
    });

    // Manejar el envío del formulario de checkout
    document.getElementById('checkout-btn').addEventListener('click', (e) => {
        if (cart.length === 0) {
            alert('El carrito está vacío. Agrega un arreglo antes de continuar.');
            return;
        }
        
        // Validar los campos de entrega
        const deliveryName = document.getElementById('delivery-name').value;
        const deliveryAddress = document.getElementById('delivery-address').value;
        const deliveryDate = document.getElementById('delivery-date').value;
        const deliveryTime = document.getElementById('delivery-time').value;

        if (!deliveryName || !deliveryAddress || !deliveryDate || !deliveryTime) {
            alert('Por favor, completa todos los campos de entrega.');
            return;
        }

        const order = {
            items: cart,
            delivery: {
                name: deliveryName,
                address: deliveryAddress,
                date: deliveryDate,
                time: deliveryTime
            },
            total: cart.reduce((sum, item) => sum + item.price, 0) + DELIVERY_COST
        };
        
        console.log('Pedido procesado:', order);
        alert('¡Tu pedido ha sido procesado! Nos pondremos en contacto contigo para los detalles de pago. Gracias por tu compra.');
        
        // Limpiar carrito y formulario
        cart = [];
        updateCart();
        checkoutForm.reset();
        showPage('home-page');
    });

    // Inicializar la página
    renderCatalog();
    updateCart(); // Carga el carrito desde localStorage
});