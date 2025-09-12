document.addEventListener('DOMContentLoaded', () => {
    const productNameElement = document.getElementById('product-name');
    const downloadButton = document.getElementById('download-button');

    // Mapeo de IDs de productos a la URL de descarga completa y CORRECTA
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

    // Obtenemos el ID del producto de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        const productName = productId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const downloadUrl = downloadLinks[productId];

        if (productNameElement) {
            productNameElement.textContent = productName;
        }

        if (downloadButton && downloadUrl) {
            downloadButton.href = downloadUrl;
            downloadButton.style.display = 'inline-block';
        } else if (downloadButton) {
            downloadButton.textContent = 'Descarga no disponible';
            downloadButton.classList.add('disabled');
            downloadButton.href = '#';
        }
    } else if (productNameElement) {
        productNameElement.textContent = 'Error: Producto no especificado.';
        if (downloadButton) {
            downloadButton.style.display = 'none';
        }
    }
});