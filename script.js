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
// Código para carrito, historial, búsqueda y descargas
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {

    // Función global para agregar al carrito
    window.addToCart = function(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let existing = cart.find(item => item.id === product.id);
        if (existing) existing.quantity += 1;
        else { product.quantity = 1; cart.push(product); }
        localStorage.setItem('cart', JSON.stringify(cart));
        showNotification('¡Producto añadido al carrito!');
    }

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

    // Productos
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

    function saveToHistory(productId) {
        let history = JSON.parse(localStorage.getItem('history')) || [];
        history = history.filter(id => id !== productId);
        history.unshift(productId);
        history = history.slice(0,50);
        localStorage.setItem('history', JSON.stringify(history));
    }

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

    // Botones agregar al carrito
    const addBtns = document.querySelectorAll('.add-to-cart-btn');
    addBtns.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const product = {
                id: btn.dataset.id,
                name: btn.dataset.name,
                price: parseFloat(btn.dataset.price),
                image: btn.dataset.image,
                downloadLink: btn.dataset.download,
                quantity: 1
            };
            window.addToCart(product);
        });
    });

    // =========================================================================
    // Descargas digitales
    // =========================================================================
    const downloadsContainer = document.getElementById('downloads-items-container');
    const noDownloadsMsg = document.getElementById('no-digital-downloads-message');

    function renderDownloads() {
        if (!downloadsContainer) return;
        downloadsContainer.innerHTML = '';

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let digital = cart.filter(item => item.downloadLink);

        if (digital.length === 0) {
            noDownloadsMsg.style.display = 'block';
            return;
        }
        noDownloadsMsg.style.display = 'none';

        digital.forEach((item, idx) => {
            if (item.downloads === undefined) item.downloads = 0;
            const remaining = item.quantity - item.downloads;

            const div = document.createElement('div');
            div.classList.add('purchase-item');
            div.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Precio: $${item.price.toFixed(2)} MXN</p>
                    <p>Cantidad: ${item.quantity}</p>
                    <p>Descargas restantes: ${remaining}</p>
                </div>
                ${remaining > 0 
                    ? `<a class="download-button" href="${item.downloadLink}" target="_blank" data-idx="${idx}">Descargar</a>` 
                    : '<span class="download-button disabled">Descargas agotadas</span>'}
            `;
            downloadsContainer.appendChild(div);
        });

        // Evento para restar descargas
        downloadsContainer.querySelectorAll('.download-button').forEach(btn => {
            if (btn.tagName === "A") {
                btn.addEventListener('click', () => {
                    let cart = JSON.parse(localStorage.getItem('cart')) || [];
                    const index = btn.dataset.idx;
                    if (cart[index].downloads === undefined) cart[index].downloads = 0;
                    cart[index].downloads += 1;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderDownloads();
                });
            }
        });
    }

    renderDownloads();
});
