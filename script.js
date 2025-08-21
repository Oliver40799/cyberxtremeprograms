// =========================================================================
// Código para el Carrusel
// =========================================================================
let slideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.prev-button');
const nextBtn = document.querySelector('.next-button');

// Función para mostrar la diapositiva actual
function showSlide(index) {
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    if (slides[index]) {
        slides[index].classList.add('active');
    }
}

// Función para avanzar a la siguiente diapositiva
function nextSlide() {
    slideIndex++;
    if (slideIndex >= slides.length) {
        slideIndex = 0; // Vuelve al inicio
    }
    showSlide(slideIndex);
}

// Mover a la diapositiva anterior
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        slideIndex--;
        if (slideIndex < 0) {
            slideIndex = slides.length - 1; // Va al final
        }
        showSlide(slideIndex);
    });
}

// Mover a la siguiente diapositiva
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        nextSlide();
    });
}

// Hacer que el carrusel se mueva automáticamente cada 5 segundos
if (slides.length > 1) {
    setInterval(nextSlide, 5000);
}

// =========================================================================
// Código para el carrito, historial y barra de búsqueda
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {

    const productCards = document.querySelectorAll('.product-card');

    if (productCards) {
        productCards.forEach(card => {
            card.addEventListener('click', (event) => {
                // Si el clic no es en el botón de "Añadir al carrito", redirige a la página del producto
                if (!event.target.closest('.add-to-cart-btn')) {
                    const productId = card.dataset.id;
                    saveToHistory(productId);
                    window.location.href = `producto.html?id=${productId}`;
                }
            });
        });
    }

    // Funcionalidad para guardar el ID del producto en el historial
    function saveToHistory(productId) {
        let history = JSON.parse(localStorage.getItem('history')) || [];
        // Elimina el ID si ya existe para moverlo al inicio
        history = history.filter(id => id !== productId);
        // Añade el ID al inicio del array para que los más recientes estén al principio
        history.unshift(productId);
        // Limita el historial a los últimos 50 productos para no saturar
        history = history.slice(0, 50);
        localStorage.setItem('history', JSON.stringify(history));
    }

    // Funcionalidad de la barra de búsqueda
    const searchBar = document.querySelector('.search-bar input');
    if (searchBar) {
        searchBar.addEventListener('keyup', (event) => {
            const searchTerm = event.target.value.toLowerCase();
            const products = document.querySelectorAll('.product-card');
            
            products.forEach(product => {
                const productName = product.querySelector('.product-name').textContent.toLowerCase();
                if (productName.includes(searchTerm)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }

    // Funcionalidad para agregar al carrito
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const product = {
                id: button.dataset.id,
                name: button.dataset.name,
                price: parseFloat(button.dataset.price),
                image: button.dataset.image
            };
            addToCart(product);
            showNotification('¡Producto añadido al carrito!');
        });
    });

    window.addToCart = function(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let existingProduct = cart.find(item => item.id === product.id);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            product.quantity = 1;
            cart.push(product);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        if (window.location.pathname.endsWith('carrito.html')) {
            renderCart();
        }
    }
    
    // Función para mostrar notificaciones (en vez de alert)
    function showNotification(message) {
        let notification = document.querySelector('.notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.classList.add('notification');
            document.body.appendChild(notification);
        }
        notification.textContent = message;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
});