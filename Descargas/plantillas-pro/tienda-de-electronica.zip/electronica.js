document.addEventListener('DOMContentLoaded', () => {

    // Páginas y elementos principales
    const homePage = document.getElementById('home-page');
    const productDetailPage = document.getElementById('product-detail-page');
    const cartPage = document.getElementById('cart-page');
    const comparePage = document.getElementById('compare-page');

    const navLinks = document.querySelectorAll('.nav-link');
    const productosGrid = document.getElementById('productos-grid');
    const cartCountSpan = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Elementos de la página de producto
    const productMainImage = document.getElementById('product-main-image');
    const productTitle = document.getElementById('product-title');
    const productPrice = document.getElementById('product-price');
    const productDescription = document.getElementById('product-description');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const productSpecsList = document.getElementById('product-specs');
    const reviewsContainer = document.getElementById('reviews-container');

    // Elementos del comparador
    const compareSelectorGrid = document.querySelector('.compare-selector-grid');
    const comparisonTable = document.getElementById('comparison-table');

    // Simulación de "base de datos"
    const productos = [
        {
            id: 1,
            name: 'Laptop Ultrabook',
            description: 'Un portátil ultra delgado y potente, ideal para profesionales que necesitan rendimiento y portabilidad.',
            price: 1200.00,
            image: 'https://via.placeholder.com/400x300/f0f0f0/333?text=Laptop+Ultrabook',
            specs: {
                "Pantalla": '13.3" IPS Full HD',
                "Procesador": 'Intel Core i7',
                "RAM": '16 GB',
                "Almacenamiento": '512 GB SSD'
            },
            reviews: [
                { author: 'Ana G.', rating: 5, comment: '¡La mejor laptop que he tenido! Rápida y la batería dura todo el día.' },
                { author: 'Juan P.', rating: 4, comment: 'Muy potente, aunque la pantalla podría ser más brillante.' }
            ]
        },
        {
            id: 2,
            name: 'Auriculares Inalámbricos',
            description: 'Auriculares con cancelación de ruido activa y sonido de alta fidelidad, perfectos para la música y las llamadas.',
            price: 250.00,
            image: 'https://via.placeholder.com/400x300/f0f0f0/333?text=Auriculares+Inalámbricos',
            specs: {
                "Conectividad": 'Bluetooth 5.2',
                "Batería": '20 horas',
                "Cancelación": 'Activa',
                "Peso": '250g'
            },
            reviews: [
                { author: 'Sofía M.', rating: 5, comment: 'La calidad de sonido es impresionante. Muy cómodos.' }
            ]
        },
        {
            id: 3,
            name: 'Smartwatch Fitness',
            description: 'Reloj inteligente con monitor de ritmo cardíaco, GPS y seguimiento de actividad para un estilo de vida saludable.',
            price: 150.00,
            image: 'https://via.placeholder.com/400x300/f0f0f0/333?text=Smartwatch+Fitness',
            specs: {
                "Resistencia": 'IP68 (sumergible)',
                "Batería": '7 días',
                "Sensores": 'Ritmo cardíaco, GPS'
            },
            reviews: [
                { author: 'David L.', rating: 3, comment: 'Buena relación calidad-precio. A veces el GPS falla un poco.' },
                { author: 'Laura C.', rating: 5, comment: 'Me encanta. Sencillo de usar y el seguimiento es muy preciso.' }
            ]
        },
        {
            id: 4,
            name: 'Monitor Gaming 4K',
            description: 'Monitor de 27 pulgadas con resolución 4K y 144Hz, perfecto para los gamers más exigentes.',
            price: 650.00,
            image: 'https://via.placeholder.com/400x300/f0f0f0/333?text=Monitor+Gaming',
            specs: {
                "Tamaño": '27"',
                "Resolución": '4K UHD (3840x2160)',
                "Tasa de Refresco": '144Hz',
                "Panel": 'IPS'
            },
            reviews: [
                { author: 'Alex R.', rating: 5, comment: 'Los colores son increíbles y la fluidez en los juegos es espectacular.' }
            ]
        }
    ];

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let productsToCompare = [];
    
    // Funciones de navegación
    function showPage(pageId) {
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(pageId).classList.remove('hidden');

        // Actualizar clase activa del nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageId.replace('-page', '')) {
                link.classList.add('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.closest('a').dataset.page;
            showPage(`${page}-page`);
        });
    });

    // Lógica del Carrito
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        cartCountSpan.textContent = cart.length;
        renderCartItems();
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center" style="text-align: center; color: var(--light-text-color);">El carrito está vacío.</p>';
            cartTotalSpan.textContent = '0.00';
            checkoutBtn.disabled = true;
            return;
        }

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotalSpan.textContent = total.toFixed(2);
        checkoutBtn.disabled = false;

        cart.forEach(item => {
            const cartItemEl = document.createElement('div');
            cartItemEl.classList.add('cart-item');
            cartItemEl.innerHTML = `
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p class="price">${item.price.toFixed(2)} USD</p>
                    </div>
                </div>
                <button class="remove-btn" data-id="${item.id}"><i class="fa-solid fa-trash-can"></i></button>
            `;
            cartItemsContainer.appendChild(cartItemEl);
        });
    }

    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.closest('.remove-btn')) {
            const itemId = parseInt(e.target.closest('.remove-btn').dataset.id);
            cart = cart.filter(item => item.id !== itemId);
            updateCart();
        }
    });

    checkoutBtn.addEventListener('click', () => {
        alert('¡Compra finalizada con éxito! Gracias por tu compra.');
        cart = [];
        updateCart();
        showPage('home-page');
    });

    // Lógica de la página de productos
    function renderProductCards() {
        productosGrid.innerHTML = '';
        productos.forEach(producto => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.dataset.id = producto.id;
            card.innerHTML = `
                <img src="${producto.image}" alt="${producto.name}">
                <div class="product-info">
                    <h3>${producto.name}</h3>
                    <p class="price">${producto.price.toFixed(2)} USD</p>
                    <div class="card-actions">
                        <button class="cta-btn view-btn"><i class="fa-solid fa-eye"></i> Ver Detalle</button>
                        <button class="compare-btn cta-btn"><i class="fa-solid fa-plus"></i> Comparar</button>
                    </div>
                </div>
            `;
            productosGrid.appendChild(card);
        });
    }

    productosGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        if (!card) return;
        const productId = parseInt(card.dataset.id);
        const producto = productos.find(p => p.id === productId);

        if (e.target.classList.contains('view-btn')) {
            renderProductDetail(producto);
            showPage('product-detail-page');
        } else if (e.target.classList.contains('compare-btn')) {
            toggleCompare(producto, e.target);
        }
    });

    function renderProductDetail(producto) {
        productMainImage.src = producto.image;
        productMainImage.alt = producto.name;
        productTitle.textContent = producto.name;
        productPrice.textContent = `${producto.price.toFixed(2)} USD`;
        productDescription.textContent = producto.description;

        // Ficha técnica
        productSpecsList.innerHTML = '';
        for (const spec in producto.specs) {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${spec}:</strong> ${producto.specs[spec]}`;
            productSpecsList.appendChild(li);
        }

        // Opiniones de clientes
        reviewsContainer.innerHTML = '';
        if (producto.reviews.length === 0) {
            reviewsContainer.innerHTML = '<p>No hay opiniones aún. Sé el primero en comentar.</p>';
        } else {
            producto.reviews.forEach(review => {
                const reviewEl = document.createElement('div');
                reviewEl.classList.add('review');
                reviewEl.innerHTML = `
                    <div class="review-header">
                        <span class="review-author">${review.author}</span>
                        <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                    </div>
                    <p>${review.comment}</p>
                `;
                reviewsContainer.appendChild(reviewEl);
            });
        }
        
        // Añadir al carrito
        addToCartBtn.dataset.id = producto.id;
    }

    addToCartBtn.addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.id);
        const producto = productos.find(p => p.id === productId);
        cart.push(producto);
        updateCart();
        alert(`"${producto.name}" se añadió al carrito.`);
    });

    // Lógica del Comparador
    function toggleCompare(producto, btn) {
        const index = productsToCompare.findIndex(p => p.id === producto.id);

        if (index > -1) {
            productsToCompare.splice(index, 1);
            btn.classList.remove('selected');
            btn.innerHTML = '<i class="fa-solid fa-plus"></i> Comparar';
        } else {
            if (productsToCompare.length >= 3) {
                alert('Solo puedes comparar un máximo de 3 productos.');
                return;
            }
            productsToCompare.push(producto);
            btn.classList.add('selected');
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Añadido';
        }
    }

    function renderComparisonSelectors() {
        compareSelectorGrid.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const selector = document.createElement('div');
            selector.classList.add('product-selector');
            selector.innerHTML = `
                <h3>Producto ${i + 1}</h3>
                <select data-selector-id="${i}">
                    <option value="">-- Selecciona un producto --</option>
                    ${productos.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                </select>
            `;
            compareSelectorGrid.appendChild(selector);
        }
        const compareButton = document.createElement('button');
        compareButton.classList.add('cta-btn');
        compareButton.id = 'run-compare-btn';
        compareButton.textContent = 'Comparar';
        compareSelectorGrid.appendChild(compareButton);
    }

    comparePage.addEventListener('click', (e) => {
        if (e.target.id === 'run-compare-btn') {
            const selectedIds = Array.from(document.querySelectorAll('.product-selector select')).map(select => parseInt(select.value)).filter(id => !isNaN(id));
            
            const uniqueIds = [...new Set(selectedIds)];
            if (uniqueIds.length !== selectedIds.length) {
                alert('No puedes comparar el mismo producto más de una vez.');
                return;
            }

            const selectedProducts = productos.filter(p => uniqueIds.includes(p.id));
            renderComparisonTable(selectedProducts);
        }
    });

    function renderComparisonTable(selectedProducts) {
        if (selectedProducts.length === 0) {
            comparisonTable.classList.add('hidden');
            return;
        }

        comparisonTable.classList.remove('hidden');
        let tableHTML = '<thead><tr><th>Característica</th>';
        selectedProducts.forEach(p => {
            tableHTML += `<th>${p.name}</th>`;
        });
        tableHTML += '</tr></thead><tbody>';

        const allSpecs = new Set();
        selectedProducts.forEach(p => {
            Object.keys(p.specs).forEach(spec => allSpecs.add(spec));
        });
        
        allSpecs.forEach(spec => {
            tableHTML += `<tr><td class="product-column">${spec}</td>`;
            selectedProducts.forEach(p => {
                tableHTML += `<td>${p.specs[spec] || 'N/A'}</td>`;
            });
            tableHTML += '</tr>';
        });

        tableHTML += '</tbody>';
        comparisonTable.innerHTML = tableHTML;
    }

    // Inicializar la página
    renderProductCards();
    renderComparisonSelectors();
    updateCart();
    showPage('home-page'); // Mostrar la página de inicio por defecto
});