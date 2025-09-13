document.addEventListener('DOMContentLoaded', () => { 
    const productNameElement = document.getElementById('product-name');
    const downloadButton = document.getElementById('download-button');

    // Crear toast
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.style = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #333;
        color: #fff;
        padding: 12px 20px;
        border-radius: 8px;
        opacity: 0;
        transition: opacity 0.5s;
        z-index: 1000;
    `;
    document.body.appendChild(toast);

    function showToast(message) {
        toast.textContent = message;
        toast.style.opacity = '1';
        setTimeout(() => { toast.style.opacity = '0'; }, 3000);
    }

    const downloadLinks = {
        'agencia-de-marketing-digital': '/Descargas/plantillas-pro/agencia-de-marketing-digital.zip',
        'academia-de-cursos-online': '/Descargas/plantillas-pro/academia-de-cursos-online.zip',
        'agencia-de-viajes': '/Descargas/plantillas-pro/agencia-de-viajes.zip',
        'clinica-medica-con-citas': '/Descargas/plantillas-pro/clinica-medica-con-citas.zip',
        'diseno-de-interiores': '/Descargas/plantillas-pro/diseno-de-interiores.zip',
        'editorial-o-libreria-online': '/Descargas/plantillas-pro/editorial-o-libreria-online.zip',
        'floreria-con-envios': '/Descargas/plantillas-pro/floreria-con-envios.zip',
        'gimnasio-con-membresias': '/Descargas/plantillas-pro/gimnasio-con-membresias.zip',
        'plantilla-de-asesoria-financiera': '/Descargas/plantillas-pro/plantilla-de-asesoria-financiera.zip',
        'restaurante-con-reservas': '/Descargas/plantillas-pro/restaurante-con-reservas.zip',
        'salon-de-belleza-con-agenda': '/Descargas/plantillas-pro/salon-de-belleza-con-agenda.zip',
        'servicios-de-limpieza-a-domicilio': '/Descargas/plantillas-pro/servicios-de-limpieza-a-domicilio.zip',
        'sitio-de-fotografo-profesional': '/Descargas/plantillas-pro/sitio-de-fotografo-profesional.zip',
        'sitio-para-musica-y-bandas': '/Descargas/plantillas-pro/sitio-para-musica-y-bandas.zip',
        'sitio-para-podcast': '/Descargas/plantillas-pro/sitio-para-podcast.zip',
        'tienda-de-alimentos-organicos': '/Descargas/plantillas-pro/tienda-de-alimentos-organicos.zip',
        'tienda-de-electronica': '/Descargas/plantillas-pro/tienda-de-electronica.zip',
        'tienda-de-muebles': '/Descargas/plantillas-pro/tienda-de-muebles.zip',
        'tienda-de-ropa-minimalista': '/Descargas/plantillas-pro/tienda-de-ropa-minimalista.zip',
        'venta-de-productos-digitales': '/Descargas/plantillas-pro/venta-de-productos-digitales.zip'
    };

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        if (productNameElement) productNameElement.textContent = 'Error: Producto no especificado.';
        if (downloadButton) downloadButton.style.display = 'none';
        return;
    }

    const productName = productId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    if (productNameElement) productNameElement.textContent = productName;

    const downloadUrl = downloadLinks[productId];
    if (!downloadUrl) {
        if (downloadButton) {
            downloadButton.textContent = 'Descarga no disponible';
            downloadButton.classList.add('disabled');
            downloadButton.removeAttribute('href');
            downloadButton.removeAttribute('download');
        }
        return;
    }

    // Obtener descargas reales del historial
    let history = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
    let item = history.find(p => p.id === productId);
    const currentDownloads = item ? (item.downloads || 0) : 0;
    const quantityCount = item ? item.quantity : 0;

    if (downloadButton) {
        if (currentDownloads >= quantityCount) {
            downloadButton.textContent = 'Descargas agotadas';
            downloadButton.classList.add('disabled');
            downloadButton.removeAttribute('href');
            downloadButton.removeAttribute('download');

            downloadButton.addEventListener('click', (e) => {
                e.preventDefault();
                showToast("Tus descargas ya se agotaron.");
            });

            if (productNameElement) {
                productNameElement.textContent = `Descargas agotadas para ${productName}`;
            }
        } else {
            downloadButton.download = downloadUrl.split('/').pop();
            downloadButton.href = downloadUrl;
            downloadButton.style.display = 'inline-block';

            downloadButton.addEventListener('click', (e) => {
                e.preventDefault();

                let history = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
                let item = history.find(p => p.id === productId);

                if (item && item.downloads < item.quantity) {
                    // Abrir la descarga en otra pestaña para que se procese
                    window.open(downloadUrl, '_blank');

                    // Actualizar contador
                    item.downloads = (item.downloads || 0) + 1;
                    localStorage.setItem('purchaseHistory', JSON.stringify(history));

                    // Bloquear botón si se agotó
                    if (item.downloads >= item.quantity) {
                        downloadButton.textContent = 'Descargas agotadas';
                        downloadButton.classList.add('disabled');
                        downloadButton.removeAttribute('href');
                        downloadButton.removeAttribute('download');

                        downloadButton.addEventListener('click', (e) => {
                            e.preventDefault();
                            showToast("Tus descargas ya se agotaron.");
                        });

                        if (productNameElement) {
                            productNameElement.textContent = `Descargas agotadas para ${productName}`;
                        }
                    }
                }
            });
        }
    }
});
