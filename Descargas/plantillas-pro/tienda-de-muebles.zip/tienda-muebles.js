document.addEventListener('DOMContentLoaded', () => {

    const homePage = document.getElementById('home-page');
    const productDetailPage = document.getElementById('product-detail-page');
    const cartPage = document.getElementById('cart-page');
    
    const homeLink = document.getElementById('home-link');
    const cartLink = document.getElementById('cart-link');
    const shopNowBtn = document.getElementById('shop-now-btn');

    const productsGrid = document.querySelector('.products-grid');
    const cartCountSpan = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalSpan = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    const productMainImage = document.getElementById('product-main-image');
    const thumbnailTrack = document.getElementById('thumbnail-track');
    const productTitle = document.getElementById('product-title');
    const productPrice = document.getElementById('product-price');
    const productDescription = document.getElementById('product-description');
    const colorOptionsContainer = document.getElementById('color-options-container');
    const materialOptionsContainer = document.getElementById('material-options-container'); // Nuevo contenedor para materiales
    const addToCartBtn = document.getElementById('add-to-cart-btn');

    // Simulación de "base de datos" de productos
    const products = {
        1: {
            id: 1,
            name: 'Sillón Contemporáneo',
            description: 'Un sillón de diseño minimalista que combina comodidad y estilo, perfecto para cualquier sala moderna.',
            price: 750.00,
            options: {
                colors: {
                    gray: {
                        name: 'Gris Oscuro',
                        images: ['https://via.placeholder.com/600x450/a0a0a0/fff?text=Sillón+Gris+Frontal', 'https://via.placeholder.com/600x450/a0a0a0/fff?text=Sillón+Gris+Lateral']
                    },
                    blue: {
                        name: 'Azul Eléctrico',
                        images: ['https://via.placeholder.com/600x450/3498db/fff?text=Sillón+Azul+Frontal', 'https://via.placeholder.com/600x450/3498db/fff?text=Sillón+Azul+Lateral']
                    },
                    red: {
                        name: 'Rojo Vibrante',
                        images: ['https://via.placeholder.com/600x450/e74c3c/fff?text=Sillón+Rojo+Frontal', 'https://via.placeholder.com/600x450/e74c3c/fff?text=Sillón+Rojo+Lateral']
                    }
                },
                materials: {
                    tela: { name: 'Tela Premium', price_adjust: 0 },
                    cuero: { name: 'Cuero Genuino', price_adjust: 200 }
                }
            },
            currentImageIndex: 0,
            selectedColor: 'gray',
            selectedMaterial: 'tela'
        },
        2: {
            id: 2,
            name: 'Mesa de Centro Industrial',
            description: 'Mesa robusta con estructura de metal y tablero de madera maciza, ideal para un toque industrial.',
            price: 320.00,
            options: {
                colors: {
                    gray: {
                        name: 'Gris Grafito',
                        images: ['https://via.placeholder.com/600x450/b8b8b8/fff?text=Mesa+Grafito+Frontal', 'https://via.placeholder.com/600x450/b8b8b8/fff?text=Mesa+Grafito+Superior']
                    },
                    brown: {
                        name: 'Marrón Óxido',
                        images: ['https://via.placeholder.com/600x450/8b4513/fff?text=Mesa+Óxido+Frontal', 'https://via.placeholder.com/600x450/8b4513/fff?text=Mesa+Óxido+Superior']
                    }
                },
                materials: {
                    madera: { name: 'Madera de Roble', price_adjust: 0 },
                    metal: { name: 'Metal Reforzado', price_adjust: 50 }
                }
            },
            currentImageIndex: 0,
            selectedColor: 'gray',
            selectedMaterial: 'madera'
        },
        3: {
            id: 3,
            name: 'Lámpara de Pie Minimalista',
            description: 'Lámpara elegante con diseño delgado y luz cálida, perfecta para iluminar cualquier rincón.',
            price: 180.00,
            options: {
                colors: {
                    black: {
                        name: 'Negro Mate',
                        images: ['https://via.placeholder.com/600x450/333/fff?text=Lámpara+Negra+Frontal', 'https://via.placeholder.com/600x450/333/fff?text=Lámpara+Negra+Detalle']
                    },
                    white: {
                        name: 'Blanco Puro',
                        images: ['https://via.placeholder.com/600x450/ccc/000?text=Lámpara+Blanca+Frontal', 'https://via.placeholder.com/600x450/ccc/000?text=Lámpara+Blanca+Detalle']
                    }
                },
                materials: {
                    metal: { name: 'Metal Ligero', price_adjust: 0 }
                }
            },
            currentImageIndex: 0,
            selectedColor: 'black',
            selectedMaterial: 'metal'
        }
    };
    
    let currentProduct = null;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Funciones de navegación
    function showPage(pageId) {
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
    }

    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('home-page');
    });

    cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('cart-page');
    });

    shopNowBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('home-page');
    });

    // Lógica del Carrito
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        cartCountSpan.textContent = cart.length;
        renderCartItems();
    }

    function renderCartItems() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; color: #bbb;">Tu carrito está vacío.</p>';
            cartTotalSpan.textContent = '0.00';
            checkoutBtn.disabled = true;
            return;
        }

        const total = cart.reduce((sum, item) => sum + item.finalPrice, 0);
        cartTotalSpan.textContent = total.toFixed(2);
        checkoutBtn.disabled = false;

        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.selectedColorName} / ${item.selectedMaterialName}</p>
                    <p class="price">$${item.finalPrice.toFixed(2)}</p>
                </div>
                <button class="remove-from-cart-btn" data-cart-item-id="${item.cartItemId}">Eliminar</button>
            </div>
        `).join('');
    }

    // Lógica de la página de productos
    productsGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-product-btn')) {
            const card = e.target.closest('.product-card');
            const productId = parseInt(card.dataset.productId);
            currentProduct = products[productId];
            
            // Reiniciar opciones seleccionadas al abrir el detalle
            currentProduct.selectedColor = Object.keys(currentProduct.options.colors)[0];
            currentProduct.selectedMaterial = Object.keys(currentProduct.options.materials)[0];
            currentProduct.currentImageIndex = 0;


            productTitle.textContent = currentProduct.name;
            productDescription.textContent = currentProduct.description;

            renderCustomizer();
            updateProductDisplay(); // Actualizar imagen y precio inicial
            
            showPage('product-detail-page');
        }
    });

    function updateProductDisplay() {
        const colorData = currentProduct.options.colors[currentProduct.selectedColor];
        const materialData = currentProduct.options.materials[currentProduct.selectedMaterial];

        productMainImage.src = colorData.images[currentProduct.currentImageIndex];
        
        // Actualizar precio
        let finalPrice = currentProduct.price + materialData.price_adjust;
        productPrice.textContent = `$${finalPrice.toFixed(2)}`;

        // Renderizar miniaturas
        thumbnailTrack.innerHTML = colorData.images.map((imgSrc, index) => `
            <img src="${imgSrc}" class="thumbnail ${index === currentProduct.currentImageIndex ? 'active' : ''}" data-thumbnail-index="${index}" alt="Thumbnail ${index + 1}">
        `).join('');

        // Activar swatches de color y material
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.classList.remove('active');
            if (swatch.dataset.color === currentProduct.selectedColor) {
                swatch.classList.add('active');
            }
        });
        document.querySelectorAll('.material-option').forEach(option => {
            option.classList.remove('active');
            if (option.dataset.material === currentProduct.selectedMaterial) {
                option.classList.add('active');
            }
        });
    }

    function renderCustomizer() {
        // Renderizar opciones de color
        colorOptionsContainer.innerHTML = '';
        const colors = Object.keys(currentProduct.options.colors);
        colors.forEach(colorKey => {
            const swatch = document.createElement('div');
            swatch.classList.add('color-swatch');
            swatch.dataset.color = colorKey;
            // Usar el color del dato para el background si existe, sino un fallback
            swatch.style.backgroundColor = currentProduct.options.colors[colorKey].cssColor || colorKey; 
            if (colorKey === currentProduct.selectedColor) {
                swatch.classList.add('active');
            }
            colorOptionsContainer.appendChild(swatch);
        });

        // Renderizar opciones de material
        materialOptionsContainer.innerHTML = '';
        const materials = Object.keys(currentProduct.options.materials);
        materials.forEach(materialKey => {
            const materialOption = document.createElement('div');
            materialOption.classList.add('material-option');
            materialOption.dataset.material = materialKey;
            materialOption.textContent = currentProduct.options.materials[materialKey].name;
            if (materialKey === currentProduct.selectedMaterial) {
                materialOption.classList.add('active');
            }
            materialOptionsContainer.appendChild(materialOption);
        });
    }

    colorOptionsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('color-swatch')) {
            const color = e.target.dataset.color;
            if (currentProduct.selectedColor !== color) {
                currentProduct.selectedColor = color;
                currentProduct.currentImageIndex = 0; // Resetear la imagen al cambiar de color
                updateProductDisplay();
            }
        }
    });

    materialOptionsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('material-option')) {
            const material = e.target.dataset.material;
            if (currentProduct.selectedMaterial !== material) {
                currentProduct.selectedMaterial = material;
                updateProductDisplay();
            }
        }
    });

    thumbnailTrack.addEventListener('click', (e) => {
        if (e.target.classList.contains('thumbnail')) {
            const index = parseInt(e.target.dataset.thumbnailIndex);
            currentProduct.currentImageIndex = index;
            updateProductDisplay();
        }
    });

    addToCartBtn.addEventListener('click', () => {
        const materialData = currentProduct.options.materials[currentProduct.selectedMaterial];
        const colorData = currentProduct.options.colors[currentProduct.selectedColor];
        
        const itemToAdd = {
            cartItemId: Date.now(), // Un ID único para el item en el carrito
            id: currentProduct.id,
            name: currentProduct.name,
            selectedColor: currentProduct.selectedColor,
            selectedColorName: colorData.name,
            selectedMaterial: currentProduct.selectedMaterial,
            selectedMaterialName: materialData.name,
            basePrice: currentProduct.price,
            materialPriceAdjust: materialData.price_adjust,
            finalPrice: currentProduct.price + materialData.price_adjust,
            imageUrl: colorData.images[0] // Usar la primera imagen como miniatura en el carrito
        };
        cart.push(itemToAdd);
        updateCart();
        alert(`"${itemToAdd.name} (${itemToAdd.selectedColorName}, ${itemToAdd.selectedMaterialName})" ha sido agregado al carrito.`);
    });
    
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-cart-btn')) {
            const cartItemIdToRemove = parseInt(e.target.dataset.cartItemId);
            cart = cart.filter(item => item.cartItemId !== cartItemIdToRemove);
            updateCart();
        }
    });

    checkoutBtn.addEventListener('click', () => {
        alert('Simulando pago... ¡Compra exitosa!');
        cart = [];
        updateCart();
        showPage('home-page');
    });

    // Inicializar el carrito
    updateCart();

});