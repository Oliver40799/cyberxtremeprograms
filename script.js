// =========================================================================
// Código para el Carrusel
// =========================================================================
let slideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.prev-button');
const nextBtn = document.querySelector('.next-button');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    if (slides[index]) slides[index].classList.add('active');
}

function nextSlide() {
    slideIndex++;
    if (slideIndex >= slides.length) slideIndex = 0;
    showSlide(slideIndex);
}

if (prevBtn) prevBtn.addEventListener('click', () => {
    slideIndex--;
    if (slideIndex < 0) slideIndex = slides.length - 1;
    showSlide(slideIndex);
});

if (nextBtn) nextBtn.addEventListener('click', () => nextSlide());
if (slides.length > 1) setInterval(nextSlide, 5000);

// =========================================================================
// Código principal
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {

    // Función para agregar al carrito
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.quantity += 1;
        } else {
            product.quantity = 1;
            product.isDigital = product.isDigital || false;
            cart.push(product);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        showNotification('¡Producto añadido al carrito!');
    }

    // Muestra una notificación temporal
    function showNotification(message) {
        let notification = document.querySelector('.notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.classList.add('notification');
            document.body.appendChild(notification);
        }
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
    }
    
    // Función para guardar en el historial
    function saveToHistory(productId) {
        let history = JSON.parse(localStorage.getItem('history')) || [];
        history = history.filter(id => id !== productId);
        history.unshift(productId);
        history = history.slice(0, 50);
        localStorage.setItem('history', JSON.stringify(history));
    }

    // Escucha clics en los botones "Añadir al carrito"
    const addBtns = document.querySelectorAll('.add-to-cart-btn');
    addBtns.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const product = {
                id: btn.dataset.id,
                name: btn.dataset.name,
                price: parseFloat(btn.dataset.price),
                image: btn.dataset.image,
                isDigital: btn.dataset.digital === "true", 
                quantity: 1
            };
            addToCart(product);
        });
    });

    // Escucha clics en las tarjetas de producto para historial
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', e => {
            if (!e.target.closest('.add-to-cart-btn')) {
                const productId = card.dataset.id;
                saveToHistory(productId);
                window.location.href = `producto.html?id=${productId}`;
            }
        });
    });

    // Barra de búsqueda
    const searchBar = document.querySelector('.search-bar input');
    if (searchBar) {
        searchBar.addEventListener('keyup', e => {
            const term = e.target.value.toLowerCase();
            productCards.forEach(product => {
                const name = product.querySelector('.product-name').textContent.toLowerCase();
                product.style.display = name.includes(term) ? 'block' : 'none';
            });
        });
    }
});