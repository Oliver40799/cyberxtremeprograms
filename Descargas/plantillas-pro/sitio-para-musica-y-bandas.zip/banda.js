document.addEventListener('DOMContentLoaded', () => {

    // Páginas y elementos principales
    const homePage = document.getElementById('home-page');
    const storePage = document.getElementById('store-page');
    const cartPage = document.getElementById('cart-page');
    const tourPage = document.getElementById('tour-page');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Música
    const playPauseBtn = document.getElementById('play-pause-btn');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const currentTrackTitle = document.getElementById('current-track-title');
    const currentTrackArtist = document.getElementById('current-track-artist');
    const currentTrackCover = document.getElementById('current-track-cover');
    const playlistEl = document.getElementById('playlist');
    const audioPlayer = new Audio();
    let currentTrackIndex = 0;

    // Tienda
    const merchGrid = document.getElementById('merch-grid');
    const cartCountSpan = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalSpan = document.getElementById('cart-total');

    // Tour
    const tourCalendar = document.getElementById('tour-calendar');

    // Simulación de "base de datos"
    const canciones = [
        { title: 'Highway to the Horizon', artist: 'The Riff Riders', file: 'audio/track1.mp3', cover: 'https://via.placeholder.com/200/e74c3c/fff?text=TRACK+1' },
        { title: 'Electric Serenade', artist: 'The Riff Riders', file: 'audio/track2.mp3', cover: 'https://via.placeholder.com/200/34495e/fff?text=TRACK+2' },
        { title: 'Midnight Rumble', artist: 'The Riff Riders', file: 'audio/track3.mp3', cover: 'https://via.placeholder.com/200/2c3e50/fff?text=TRACK+3' },
    ];
    // Nota: Reemplazar `audio/trackX.mp3` con rutas reales o URL de los archivos de audio.

    const productos = [
        { id: 1, name: 'Camiseta Riff Riders', price: 25.00, image: 'https://via.placeholder.com/400x400/1c1c1c/fff?text=T-Shirt' },
        { id: 2, name: 'Álbum "Rhythm & Bones"', price: 15.00, image: 'https://via.placeholder.com/400x400/2c3e50/fff?text=Album' },
        { id: 3, name: 'Sudadera con Capucha', price: 45.00, image: 'https://via.placeholder.com/400x400/e74c3c/fff?text=Hoodie' },
        { id: 4, name: 'Poster Edición Limitada', price: 10.00, image: 'https://via.placeholder.com/400x400/95a5a6/fff?text=Poster' }
    ];

    const conciertos = [
        { date: '15 de Octubre, 2025', venue: 'Sala Metrópolis', city: 'Madrid, España' },
        { date: '22 de Octubre, 2025', venue: 'The Cavern Club', city: 'Liverpool, UK' },
        { date: '5 de Noviembre, 2025', venue: 'Whisky a Go Go', city: 'Los Ángeles, USA' },
        { date: '18 de Noviembre, 2025', venue: 'Estadio Obras', city: 'Buenos Aires, Argentina' }
    ];

    let cart = JSON.parse(localStorage.getItem('banda_cart')) || [];

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

    // Lógica del Reproductor de Música
    function loadTrack(index) {
        if (canciones[index]) {
            const track = canciones[index];
            audioPlayer.src = track.file;
            currentTrackTitle.textContent = track.title;
            currentTrackArtist.textContent = track.artist;
            currentTrackCover.src = track.cover;
            
            // Actualizar clase activa en la lista
            document.querySelectorAll('.playlist li').forEach((li, i) => {
                li.classList.toggle('active', i === index);
            });
            audioPlayer.play();
            playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        }
    }

    function togglePlayPause() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        } else {
            audioPlayer.pause();
            playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        }
    }

    playPauseBtn.addEventListener('click', togglePlayPause);
    nextBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % canciones.length;
        loadTrack(currentTrackIndex);
    });
    prevBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex - 1 + canciones.length) % canciones.length;
        loadTrack(currentTrackIndex);
    });
    audioPlayer.addEventListener('ended', () => {
        nextBtn.click();
    });

    function renderPlaylist() {
        playlistEl.innerHTML = canciones.map((track, index) => `
            <li data-index="${index}">${track.title}</li>
        `).join('');
    }

    playlistEl.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            const index = parseInt(e.target.dataset.index);
            currentTrackIndex = index;
            loadTrack(currentTrackIndex);
        }
    });

    // Lógica de la Tienda
    function renderMerch() {
        merchGrid.innerHTML = productos.map(prod => `
            <div class="merch-card">
                <img src="${prod.image}" alt="${prod.name}">
                <div class="merch-info">
                    <h3>${prod.name}</h3>
                    <p class="price">$${prod.price.toFixed(2)}</p>
                    <button class="cta-btn add-to-cart-btn" data-id="${prod.id}"><i class="fa-solid fa-plus"></i> Añadir al Carrito</button>
                </div>
            </div>
        `).join('');
    }

    function updateCart() {
        localStorage.setItem('banda_cart', JSON.stringify(cart));
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

        cart.forEach(item => {
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
                <button class="remove-btn" data-id="${item.id}"><i class="fa-solid fa-trash-can"></i></button>
            `;
            cartItemsContainer.appendChild(cartItemEl);
        });
    }

    merchGrid.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart-btn')) {
            const productId = parseInt(e.target.closest('button').dataset.id);
            const product = productos.find(p => p.id === productId);
            cart.push(product);
            updateCart();
            alert(`"${product.name}" se añadió al carrito.`);
        }
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
    
    // Lógica del Calendario de Conciertos
    function renderTour() {
        tourCalendar.innerHTML = conciertos.map(concierto => `
            <div class="tour-date">
                <div class="date-info">${concierto.date}</div>
                <div class="location-info">
                    <h4>${concierto.venue}</h4>
                    <p>${concierto.city}</p>
                </div>
                <a href="#" class="cta-btn buy-tickets-btn"><i class="fa-solid fa-ticket"></i> Comprar Boletos</a>
            </div>
        `).join('');
    }

    // Inicializar
    renderPlaylist();
    loadTrack(currentTrackIndex); // Carga la primera canción al inicio
    renderMerch();
    renderTour();
    updateCart(); // Carga el carrito desde localStorage
});