// LÓGICA DEL CARRUSEL
let slideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;
const intervalTime = 3000; // Cambia cada 3 segundos

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

function nextSlide() {
    slideIndex = (slideIndex + 1) % totalSlides;
    showSlide(slideIndex);
}

// Carrusel automático
let carouselInterval = setInterval(nextSlide, intervalTime);

// Control manual de botones
document.querySelector('.carousel-button.next').addEventListener('click', () => {
    clearInterval(carouselInterval);
    nextSlide();
    carouselInterval = setInterval(nextSlide, intervalTime);
});

document.querySelector('.carousel-button.prev').addEventListener('click', () => {
    clearInterval(carouselInterval);
    slideIndex = (slideIndex - 1 + totalSlides) % totalSlides;
    showSlide(slideIndex);
    carouselInterval = setInterval(nextSlide, intervalTime);
});

// LÓGICA DEL CARRITO DE COMPRAS
document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { id: 'camiseta-negra', name: 'Camiseta Básica Negra', price: 25.00, image: 'https://via.placeholder.com/250x300' },
        { id: 'pantalon-cargo', name: 'Pantalón Cargo', price: 50.00, image: 'https://via.placeholder.com/250x300' },
        { id: 'sudadera-gris', name: 'Sudadera con Capucha Gris', price: 40.00, image: 'https://via.placeholder.com/250x300' },
        { id: 'gorra-lisa', name: 'Gorra Lisa', price: 15.00, image: 'https://via.placeholder.com/250x300' },
    ];

    const productsGrid = document.getElementById('products-grid');
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeButton = document.querySelector('.close-button');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');
    const checkoutButton = document.getElementById('checkout-button');
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function renderProducts() {
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">Añadir al Carrito</button>
            `;
            productsGrid.appendChild(productCard);
        });
        
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }

    function addToCart(event) {
        const productId = event.target.dataset.id;
        const productToAdd = products.find(p => p.id === productId);

        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...productToAdd, quantity: 1 });
        }
        saveCart();
        alert('Producto añadido al carrito');
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>El carrito está vacío.</p>';
        } else {
            cart.forEach(item => {
                total += item.price * item.quantity;
                totalItems += item.quantity;
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">Eliminar</button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
        }
        cartTotalElement.textContent = total.toFixed(2);
        cartCountElement.textContent = totalItems;
    }

    function removeFromCart(event) {
        if (event.target.classList.contains('remove-item-btn')) {
            const productId = event.target.dataset.id;
            cart = cart.filter(item => item.id !== productId);
            saveCart();
        }
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'block';
        renderCart();
    });

    closeButton.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == cartModal) {
            cartModal.style.display = 'none';
        }
    });

    cartItemsContainer.addEventListener('click', removeFromCart);

    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('El carrito está vacío. Añade productos para finalizar la compra.');
            return;
        }
        alert('Compra finalizada con éxito.');
        cart = [];
        saveCart();
        cartModal.style.display = 'none';
    });
    
    renderProducts();
    renderCart();
});