document.addEventListener('DOMContentLoaded', () => {

    // Elementos del DOM
    const portfolioGrid = document.getElementById('portfolio-grid');
    const blogGrid = document.getElementById('blog-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const quoteForm = document.getElementById('quote-form');

    // Simulación de "base de datos" para proyectos y artículos
    const proyectos = [
        {
            name: 'Residencia Moderna en el Bosque',
            image: 'https://via.placeholder.com/600x800/2c3e50/fff?text=Residencial',
            type: 'residencial',
            description: 'Diseño de concepto abierto con acabados en madera natural y piedra.'
        },
        {
            name: 'Oficinas de Tecnología',
            image: 'https://via.placeholder.com/600x800/95a5a6/fff?text=Comercial',
            type: 'comercial',
            description: 'Espacios de trabajo colaborativo con un ambiente minimalista y funcional.'
        },
        {
            name: 'Departamento Urbano',
            image: 'https://via.placeholder.com/600x800/bdc3c7/fff?text=Residencial',
            type: 'residencial',
            description: 'Optimización de espacio en un pequeño departamento con muebles a medida.'
        },
        {
            name: 'Cafetería de Especialidad',
            image: 'https://via.placeholder.com/600x800/7f8c8d/fff?text=Comercial',
            type: 'comercial',
            description: 'Diseño rústico industrial con iluminación cálida para un ambiente acogedor.'
        },
        {
            name: 'Casa de Playa',
            image: 'https://via.placeholder.com/600x800/d7e3e7/fff?text=Residencial',
            type: 'residencial',
            description: 'Uso de textiles y colores claros para evocar la tranquilidad del mar.'
        }
    ];

    const articulos = [
        {
            title: '5 Tendencias de Decoración para 2025',
            image: 'https://via.placeholder.com/600x400/2ecc71/fff?text=Tendencias+2025',
            excerpt: 'Descubre los colores, materiales y estilos que dominarán el mundo del diseño el próximo año.'
        },
        {
            title: 'Cómo Elegir la Paleta de Colores Perfecta',
            image: 'https://via.placeholder.com/600x400/3498db/fff?text=Paleta+de+Colores',
            excerpt: 'Una guía completa para seleccionar la combinación de colores que mejor se adapte a tu espacio y personalidad.'
        },
        {
            title: 'Iluminación Inteligente para tu Hogar',
            image: 'https://via.placeholder.com/600x400/f1c40f/fff?text=Iluminacion+Inteligente',
            excerpt: 'Consejos para utilizar la luz de manera estratégica para crear diferentes ambientes y mejorar la funcionalidad de tu casa.'
        }
    ];

    // Función para renderizar el portafolio
    function renderPortfolio(filterType) {
        portfolioGrid.innerHTML = '';
        const filteredProjects = filterType === 'all' ? proyectos : proyectos.filter(p => p.type === filterType);
        
        filteredProjects.forEach(proyecto => {
            const card = document.createElement('div');
            card.classList.add('portfolio-card');
            card.innerHTML = `
                <img src="${proyecto.image}" alt="${proyecto.name}">
                <div class="portfolio-info">
                    <h3>${proyecto.name}</h3>
                    <p>${proyecto.description}</p>
                </div>
            `;
            portfolioGrid.appendChild(card);
        });
    }

    // Función para renderizar el blog
    function renderBlog() {
        blogGrid.innerHTML = articulos.map(articulo => `
            <div class="blog-card">
                <img src="${articulo.image}" alt="${articulo.title}">
                <div class="blog-content">
                    <h3>${articulo.title}</h3>
                    <p>${articulo.excerpt}</p>
                    <a href="#">Leer más <i class="fa-solid fa-arrow-right"></i></a>
                </div>
            </div>
        `).join('');
    }

    // Manejar los filtros del portafolio
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(button => button.classList.remove('active'));
            btn.classList.add('active');
            renderPortfolio(btn.dataset.filter);
        });
    });

    // Manejar el envío del formulario de cotización
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('¡Solicitud de cotización enviada! Nos pondremos en contacto contigo pronto.');
        quoteForm.reset();
    });

    // Inicializar la página
    renderPortfolio('all');
    renderBlog();
});