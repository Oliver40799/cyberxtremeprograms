document.addEventListener('DOMContentLoaded', () => {
    const downloadsContainer = document.getElementById('downloads-items-container');
    const noDownloadsMessage = document.getElementById('no-digital-downloads-message');
    const clearBtn = document.getElementById('clear-purchases-button');

    // Mapeo de IDs de productos a URL de descarga
    const downloadLinks = {
        'diseno-web-avanzado': '/descargas/diseno-web-avanzado.zip',
        'tienda-en-linea-completa': '/descargas/tienda-en-linea-completa.zip',
        'landing-page-personalizada': '/descargas/landing-page-personalizada.zip',
        'academia-de-cursos-online': '/descargas/academia-de-cursos-online.zip',
        'agencia-de-marketing-digital': '/descargas/agencia-de-marketing-digital.zip',
        'agencia-de-viajes': '/descargas/agencia-de-viajes.zip',
        'clinica-medica-con-citas': '/descargas/clinica-medica-con-citas.zip',
        'diseno-de-interiores': '/descargas/diseno-de-interiores.zip',
        'editorial-o-libreria-online': '/descargas/editorial-o-libreria-online.zip',
        'floreria-con-envios': '/descargas/floreria-con-envios.zip',
        'gimnasio-con-membresias': '/descargas/gimnasio-con-membresias.zip',
        'plantilla-de-asesoria-financiera': '/descargas/plantilla-de-asesoria-financiera.zip',
        'restaurante-con-reservas': '/descargas/restaurante-con-reservas.zip',
        'salon-de-belleza-con-agenda': '/descargas/salon-de-belleza-con-agenda.zip',
        'servicios-de-limpieza-a-domicilio': '/descargas/servicios-de-limpieza-a-domicilio.zip',
        'sitio-de-fotografo-profesional': '/descargas/sitio-de-fotografo-profesional.zip',
        'sitio-para-musica-y-bandas': '/descargas/sitio-para-musica-y-bandas.zip',
        'sitio-para-podcast': '/descargas/sitio-para-podcast.zip',
        'tienda-de-alimentos-organicos': '/descargas/tienda-de-alimentos-organicos.zip',
        'tienda-de-electronica': '/descargas/tienda-de-electronica.zip',
        'tienda-de-muebles': '/descargas/tienda-de-muebles.zip',
        'tienda-de-ropa-minimalista': '/descargas/tienda-de-ropa-minimalista.zip',
        'venta-de-productos-digitales': '/descargas/venta-de-productos-digitales.zip'
    };

    function getPurchaseHistory() {
        return JSON.parse(localStorage.getItem('purchaseHistory')) || [];
    }

    function savePurchaseHistory(history) {
        localStorage.setItem('purchaseHistory', JSON.stringify(history));
    }

    function renderPurchaseHistory() {
        const purchaseHistory = getPurchaseHistory();
        if (!downloadsContainer) return;

        downloadsContainer.innerHTML = '';
        const digitalPurchases = purchaseHistory.filter(item => item.isDigital);

        if (digitalPurchases.length === 0) {
            noDownloadsMessage.style.display = 'block';
            return;
        } else {
            noDownloadsMessage.style.display = 'none';
        }

        digitalPurchases.forEach((item, index) => {
            if (item.downloads === undefined) item.downloads = 0;
            const remainingDownloads = item.quantity - item.downloads;
            const downloadUrl = downloadLinks[item.id];

            const purchaseItem = document.createElement('div');
            purchaseItem.classList.add('purchase-item');

            let downloadButtonHTML = '';
            if (remainingDownloads > 0 && downloadUrl) {
                downloadButtonHTML = `<a class="download-button" href="${downloadUrl}" target="_blank" data-id="${item.id}" data-index="${index}">Descargar (${remainingDownloads})</a>`;
            } else {
                downloadButtonHTML = '<span class="download-button disabled">Descargas agotadas</span>';
            }

            purchaseItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Precio Total: $${(item.price * item.quantity).toFixed(2)} MXN</p>
                    <p>Cantidad: ${item.quantity}</p>
                    <p>Fecha de compra: ${new Date(item.purchaseDate).toLocaleDateString()}</p>
                    <p>Descargas restantes: ${remainingDownloads}</p>
                </div>
                ${downloadButtonHTML}
            `;

            downloadsContainer.appendChild(purchaseItem);
        });

        downloadsContainer.querySelectorAll('.download-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const purchaseHistory = getPurchaseHistory();
                const index = parseInt(button.dataset.index);
                
                const itemToUpdate = purchaseHistory[index];
                if (itemToUpdate && itemToUpdate.downloads < itemToUpdate.quantity) {
                    itemToUpdate.downloads += 1;
                    savePurchaseHistory(purchaseHistory);
                    renderPurchaseHistory();
                }
            });
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm("¿Seguro quieres borrar todo tu historial de compras?")) {
                localStorage.removeItem('purchaseHistory');
                renderPurchaseHistory();
            }
        });
    }

    // ⭐ CORRECCIÓN: Fuerza la lectura de la historia al cargar la página
    renderPurchaseHistory();
});