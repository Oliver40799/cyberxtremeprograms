document.addEventListener('DOMContentLoaded', () => {

    // Páginas y elementos principales
    const homePage = document.getElementById('home-page');
    const bookDetailPage = document.getElementById('book-detail-page');
    const cartPage = document.getElementById('cart-page');
    const autoresPage = document.getElementById('autores-page');
    const navLinks = document.querySelectorAll('.nav-link');
    const booksGrid = document.getElementById('books-grid');
    const cartCountSpan = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalSpan = document.getElementById('cart-total');
    const authorsGrid = document.getElementById('authors-grid');

    // Elementos de la página de libro
    const bookCover = document.getElementById('book-cover');
    const bookTitle = document.getElementById('book-title');
    const bookAuthor = document.getElementById('book-author');
    const bookDescription = document.getElementById('book-description');
    const bookPrice = document.getElementById('book-price');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const reviewsContainer = document.getElementById('reviews-container');
    const reviewForm = document.getElementById('review-form');

    // Simulación de "base de datos"
    const libros = [
        { id: 1, title: 'El Viaje de Arcanus', author: 'Elara Vesper', price: 15.99, image: 'https://via.placeholder.com/250x350/5d001e/fff?text=El+Viaje+de+Arcanus', description: 'Una épica de fantasía que te transportará a un mundo de magia y criaturas legendarias.', reviews: [{ author: 'Clara S.', text: 'Increíble, no pude dejar de leerlo.' }] },
        { id: 2, title: 'Los Cuentos del Relojero', author: 'Liam Sombra', price: 12.50, image: 'https://via.placeholder.com/250x350/34495e/fff?text=Cuentos+del+Relojero', description: 'Una colección de relatos cortos con un toque oscuro y enigmático.', reviews: [{ author: 'Pedro G.', text: 'Muy original y bien escrito.' }, { author: 'Ana R.', text: 'Historias que te hacen pensar.' }] },
        { id: 3, title: 'La Sombra de la Duda', author: 'Isabella Cruz', price: 18.00, image: 'https://via.placeholder.com/250x350/9a1750/fff?text=Sombra+de+la+Duda', description: 'Un thriller psicológico que te mantendrá en el filo del asiento hasta la última página.', reviews: [] },
        { id: 4, title: 'Cocina Botánica', author: 'Elara Vesper', price: 25.00, image: 'https://via.placeholder.com/250x350/7f8c8d/fff?text=Cocina+Botánica', description: 'Recetas innovadoras que celebran los sabores de la naturaleza, perfecto para amantes de la cocina vegana.', reviews: [] }
    ];

    const autores = [
        { id: 1, name: 'Elara Vesper', bio: 'Autora de fantasía y libros de cocina. Ganadora del Premio a la Mejor Nueva Autora en 2024.', image: 'https://via.placeholder.com/300/e67e22/fff?text=Elara+Vesper' },
        { id: 2, name: 'Liam Sombra', bio: 'Escritor de misterio y cuentos de terror. Conocido por sus giros inesperados.', image: 'https://via.placeholder.com/300/3498db/fff?text=Liam+Sombra' },
        { id: 3, name: 'Isabella Cruz', bio: 'Reconocida novelista de thrillers psicológicos. Sus libros han sido traducidos a más de 10 idiomas.', image: 'https://via.placeholder.com/300/2ecc71/fff?text=Isabella+Cruz' }
    ];

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
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

    // Lógica del catálogo
    function renderBooks() {
        booksGrid.innerHTML = '';
        libros.forEach(libro => {
            const card = document.createElement('div');
            card.classList.add('book-card');
            card.dataset.id = libro.id;
            card.innerHTML = `
                <img src="${libro.image}" alt="${libro.title}">
                <div class="book-info">
                    <h3>${libro.title}</h3>
                    <p class="author-name">${libro.author}</p>
                    <p class="price">$${libro.price.toFixed(2)}</p>
                </div>
            `;
            booksGrid.appendChild(card);
        });
    }

    booksGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.book-card');
        if (!card) return;
        const bookId = parseInt(card.dataset.id);
        const libro = libros.find(l => l.id === bookId);
        renderBookDetail(libro);
        showPage('book-detail-page');
    });

    // Lógica de detalles del libro
    function renderBookDetail(libro) {
        bookCover.src = libro.image;
        bookCover.alt = libro.title;
        bookTitle.textContent = libro.title;
        bookAuthor.textContent = libro.author;
        bookDescription.textContent = libro.description;
        bookPrice.textContent = `$${libro.price.toFixed(2)}`;
        addToCartBtn.dataset.id = libro.id;

        // Renderizar reseñas
        reviewsContainer.innerHTML = '';
        if (libro.reviews.length === 0) {
            reviewsContainer.innerHTML = '<p>Sé el primero en dejar una reseña.</p>';
        } else {
            libro.reviews.forEach(review => {
                const reviewEl = document.createElement('div');
                reviewEl.classList.add('review');
                reviewEl.innerHTML = `
                    <p><strong>${review.author}:</strong> ${review.text}</p>
                `;
                reviewsContainer.appendChild(reviewEl);
            });
        }
    }

    // Manejar reseña
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const reviewText = document.getElementById('review-text').value;
        const bookId = parseInt(addToCartBtn.dataset.id);
        const libro = libros.find(l => l.id === bookId);
        
        // Simular un autor
        const newReview = { author: 'Lector Anónimo', text: reviewText };
        libro.reviews.push(newReview);
        
        renderBookDetail(libro);
        reviewForm.reset();
    });

    // Lógica del carrito de compras
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        cartCountSpan.textContent = cart.length;
        renderCartItems();
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--light-text-color);">El carrito está vacío.</p>';
            cartTotalSpan.textContent = '0.00';
            return;
        }

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotalSpan.textContent = total.toFixed(2);

        cart.forEach(item => {
            const cartItemEl = document.createElement('div');
            cartItemEl.classList.add('cart-item');
            cartItemEl.innerHTML = `
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="cart-item-details">
                        <h4>${item.title}</h4>
                        <p class="price">$${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <button class="remove-btn" data-id="${item.id}"><i class="fa-solid fa-trash-can"></i></button>
            `;
            cartItemsContainer.appendChild(cartItemEl);
        });
    }

    addToCartBtn.addEventListener('click', (e) => {
        const bookId = parseInt(e.target.closest('button').dataset.id);
        const libro = libros.find(l => l.id === bookId);
        cart.push(libro);
        updateCart();
        alert(`"${libro.title}" se añadió al carrito.`);
    });

    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.closest('.remove-btn')) {
            const itemId = parseInt(e.target.closest('.remove-btn').dataset.id);
            const index = cart.findIndex(item => item.id === itemId);
            if (index > -1) {
                cart.splice(index, 1);
                updateCart();
            }
        }
    });

    // Lógica de autores
    function renderAuthors() {
        authorsGrid.innerHTML = '';
        autores.forEach(autor => {
            const card = document.createElement('div');
            card.classList.add('author-card');
            card.innerHTML = `
                <img src="${autor.image}" alt="${autor.name}">
                <h3>${autor.name}</h3>
                <p>${autor.bio}</p>
            `;
            authorsGrid.appendChild(card);
        });
    }

    // Inicializar
    renderBooks();
    renderAuthors();
    updateCart();
});