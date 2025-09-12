document.addEventListener('DOMContentLoaded', () => {
    const historyListContainer = document.getElementById('history-list');
    const clearButton = document.getElementById('clear-history-button');

    // Esta es una lista de productos de ejemplo. En un proyecto real, se obtendrían de una base de datos.
    const products = [
        { id: "product-1", name: "Diseño Web Avanzado", price: 5500, image: "/Imagenes/pagina_web_ejemplo1.jpg" },
        { id: "product-2", name: "Tienda en Línea Completa", price: 9000, image: "/Imagenes/pagina_web_ejemplo2.png" },
        { id: "product-3", name: "Landing Page Personalizada", price: 3200, image: "/Imagenes/pagina_web_ejemplo3.jpg" },
        { id: "diseno-web-avanzado", name: "Diseño Web Avanzado", price: 5500, image: "/Imagenes/pagina_web_ejemplo1.jpg" },
        { id: "tienda-en-linea-completa", name: "Tienda en Línea Completa", price: 9000, image: "/Imagenes/pagina_web_ejemplo2.png" },
        { id: "landing-page-personalizada", name: "Landing Page Personalizada", price: 3200, image: "/Imagenes/pagina_web_ejemplo3.jpg" },
        { id: "academia-de-cursos-online", name: "Academia de Cursos Online", price: 7800, image: "/Imagenes/academia-de-cursos-online.jpg" },
        { id: "agencia-de-marketing-digital", name: "Agencia de Marketing Digital", price: 6200, image: "/Imagenes/agencia-de-marketing-digital.jpg" },
        { id: "agencia-de-viajes", name: "Agencia de Viajes", price: 4800, image: "/Imagenes/agencia-de-viajes.jpg" },
        { id: "clinica-medica-con-citas", name: "Clínica Médica con Citas", price: 8500, image: "/Imagenes/clinica-medica-con-citas.jpg" },
        { id: "diseno-de-interiores", name: "Diseño de Interiores", price: 4500, image: "/Imagenes/diseno-de-interiores.jpg" },
        { id: "editorial-o-libreria-online", name: "Editorial o Librería Online", price: 5900, image: "/Imagenes/editorial-o-libreria-online.jpg" },
        { id: "floreria-con-envios", name: "Florería con Envíos", price: 4100, image: "/Imagenes/floreria-con-envios.jpg" },
        { id: "gimnasio-con-membresias", name: "Gimnasio con Membresías", price: 6700, image: "/Imagenes/gimnasio-con-membresias.jpg" },
        { id: "plantilla-de-asesoria-financiera", name: "Plantilla de Asesoría Financiera", price: 3800, image: "/Imagenes/plantilla-de-asesoria-financiera.jpg" },
        { id: "restaurante-con-reservas", name: "Restaurante con Reservas", price: 5300, image: "/Imagenes/restaurante-con-reservas.jpg" },
        { id: "salon-de-belleza-con-agenda", name: "Salón de Belleza con Agenda", price: 4900, image: "/Imagenes/salon-de-belleza-con-agenda.jpg" },
        { id: "servicios-de-limpieza-a-domicilio", name: "Servicios de Limpieza a Domicilio", price: 4200, image: "/Imagenes/servicios-de-limpieza-a-domicilio.jpg" },
        { id: "sitio-de-fotografo-profesional", name: "Sitio de Fotógrafo Profesional", price: 3500, image: "/Imagenes/sitio-de-fotografo-profesional.jpg" },
        { id: "sitio-para-musica-y-bandas", name: "Sitio para Música y Bandas", price: 5100, image: "/Imagenes/sitio-para-musica-y-bandas.jpg" },
        { id: "sitio-para-podcast", name: "Sitio para Podcast", price: 4700, image: "/Imagenes/sitio-para-podcast.jpg" },
        { id: "tienda-de-alimentos-organicos", name: "Tienda de Alimentos Orgánicos", price: 6400, image: "/Imagenes/tienda-de-alimentos-organicos.jpg" },
        { id: "tienda-de-electronica", name: "Tienda de Electrónica", price: 7200, image: "/Imagenes/tienda-de-electronica.jpg" },
        { id: "tienda-de-muebles", name: "Tienda de Muebles", price: 8100, image: "/Imagenes/tienda-de-muebles.jpg" },
        { id: "tienda-de-ropa-minimalista", name: "Tienda de Ropa Minimalista", price: 4000, image: "/Imagenes/tienda-de-ropa-minimalista.jpg" },
        { id: "venta-de-productos-digitales", name: "Venta de Productos Digitales", price: 5800, image: "/Imagenes/venta-de-productos-digitales.jpg" }
    ];


    function renderHistory() {
        const historyIds = JSON.parse(localStorage.getItem('history')) || [];
        
        historyListContainer.innerHTML = ''; // Limpia el contenedor

        if (historyIds.length === 0) {
            historyListContainer.innerHTML = '<p>No has visto ningún producto todavía.</p>';
            if (clearButton) clearButton.style.display = 'none';
            return;
        }

        const uniqueHistoryIds = [...new Set(historyIds)].reverse();

        uniqueHistoryIds.forEach(productId => {
            const product = products.find(p => p.id === productId);
            if (product) {
                const productCard = document.createElement('div');
                productCard.classList.add('history-card');
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)} MXN</p>
                `;
                historyListContainer.appendChild(productCard);
            }
        });

        if (clearButton) clearButton.style.display = 'block';
    }

    if (clearButton) {
        clearButton.addEventListener('click', () => {
            const confirmClear = confirm("¿Estás seguro de que quieres limpiar tu historial de visualización?");
            if (confirmClear) {
                localStorage.removeItem('history');
                renderHistory();
            }
        });
    }

    if (window.location.pathname.endsWith('historial.html')) {
        renderHistory();
    }
});