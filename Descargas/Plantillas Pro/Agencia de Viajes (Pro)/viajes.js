document.addEventListener('DOMContentLoaded', () => {

    // Páginas y elementos principales
    const homePage = document.getElementById('home-page');
    const resultsPage = document.getElementById('results-page');
    const cotizacionPage = document.getElementById('cotizacion-page');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Buscador
    const searchForm = document.getElementById('search-form');
    const destinationInput = document.getElementById('destination');
    const resultsList = document.getElementById('results-list');
    
    // Cotización
    const quoteForm = document.getElementById('quote-form');

    // Galería de destinos
    const destinosGrid = document.getElementById('destinos-grid');

    // Simulación de "base de datos" para paquetes y destinos
    const paquetes = [
        { id: 1, destination: 'París', title: 'Romanticismo en París', price: 1200, image: 'https://via.placeholder.com/400x300/e67e22/fff?text=París', details: 'Vuelos y 5 noches en hotel 4 estrellas.' },
        { id: 2, destination: 'Tailandia', title: 'Aventura en Tailandia', price: 950, image: 'https://via.placeholder.com/400x300/16a085/fff?text=Tailandia', details: 'Vuelos, 7 noches en hotel y tour de islas.' },
        { id: 3, destination: 'Cancún', title: 'Relajación en el Caribe', price: 800, image: 'https://via.placeholder.com/400x300/3498db/fff?text=Cancún', details: 'Vuelos y 4 noches en resort todo incluido.' },
        { id: 4, destination: 'Tokio', title: 'Cultura en Tokio', price: 1500, image: 'https://via.placeholder.com/400x300/8e44ad/fff?text=Tokio', details: 'Vuelos, 6 noches en hotel y pases de transporte.' },
        { id: 5, destination: 'París', title: 'Escapada de Fin de Semana', price: 750, image: 'https://via.placeholder.com/400x300/f1c40f/fff?text=París', details: 'Vuelos y 3 noches en hotel céntrico.' },
    ];

    const destinos = [
        { name: 'París, Francia', image: 'https://via.placeholder.com/600x400/e67e22/fff?text=París', mapLink: 'https://www.google.com/maps/place/París' },
        { name: 'Cancún, México', image: 'https://via.placeholder.com/600x400/3498db/fff?text=Cancún', mapLink: 'https://www.google.com/maps/place/Cancún' },
        { name: 'Tokio, Japón', image: 'https://via.placeholder.com/600x400/8e44ad/fff?text=Tokio', mapLink: 'https://www.google.com/maps/place/Tokio' },
    ];

    // Funciones de navegación
    function showPage(pageId) {
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(pageId).classList.remove('hidden');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const page = e.target.closest('a').dataset.page;
            if (page) {
                e.preventDefault();
                showPage(`${page}-page`);
            }
        });
    });

    // Lógica del buscador
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const destination = destinationInput.value.trim().toLowerCase();
        
        const filteredPackages = paquetes.filter(p => p.destination.toLowerCase().includes(destination));
        
        renderPackages(filteredPackages);
        showPage('results-page');
    });

    function renderPackages(packageList) {
        resultsList.innerHTML = '';
        if (packageList.length === 0) {
            resultsList.innerHTML = '<p class="no-results-message">No se encontraron paquetes para tu búsqueda. <a href="#cotizacion" class="cta-link">¡Cotiza un viaje a medida!</a></p>';
            return;
        }

        packageList.forEach(pkg => {
            const card = document.createElement('div');
            card.classList.add('package-card');
            card.innerHTML = `
                <img src="${pkg.image}" alt="${pkg.title}">
                <div class="package-info">
                    <h3>${pkg.title}</h3>
                    <p class="details">${pkg.details}</p>
                    <p class="price">Desde $${pkg.price.toFixed(2)} USD</p>
                </div>
                <a href="#" class="cta-btn"><i class="fa-solid fa-cart-shopping"></i> Ver Paquete</a>
            `;
            resultsList.appendChild(card);
        });
    }

    // Lógica del formulario de cotización
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('¡Cotización enviada con éxito! Nos pondremos en contacto contigo pronto.');
        quoteForm.reset();
        showPage('home-page');
    });

    // Galería de destinos con mapas
    function renderDestinations() {
        destinosGrid.innerHTML = destinos.map(dest => `
            <div class="destination-card">
                <img src="${dest.image}" alt="${dest.name}">
                <div class="destination-info">
                    <h3>${dest.name}</h3>
                    <a href="${dest.mapLink}" target="_blank" class="view-map-btn"><i class="fa-solid fa-map-location-dot"></i> Ver en mapa</a>
                </div>
            </div>
        `).join('');
    }

    // Iniciar
    renderDestinations();
});