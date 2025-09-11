document.addEventListener('DOMContentLoaded', () => {
    const productNameElement = document.getElementById('product-name');
    const downloadButton = document.getElementById('download-button');
    
    const downloadLinks = {
        'product-1': { name: 'Diseño Web Avanzado', url: '/descargas/diseno-web-avanzado.zip' },
        'product-2': { name: 'Tienda en Línea Completa', url: '/descargas/tienda-en-linea-completa.zip' },
        'product-3': { name: 'Landing Page Personalizada', url: '/descargas/landing-page-personalizada.zip' }
        // Agrega aquí el resto de tus productos
    };

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const productData = downloadLinks[productId];

    if (productData) {
        if (productNameElement) {
            productNameElement.textContent = productData.name;
        }
        if (downloadButton) {
            downloadButton.href = productData.url;
            downloadButton.download = productData.name; // Agrega el atributo "download"
        }
    } else {
        if (productNameElement) {
            productNameElement.textContent = 'Producto no encontrado.';
        }
        if (downloadButton) {
            downloadButton.style.display = 'none';
        }
    }
});