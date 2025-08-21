document.addEventListener('DOMContentLoaded', () => {

    function agregarAlCarrito(producto) {
        let carrito = JSON.parse(localStorage.getItem('cart')) || [];
        
        const existeEnCarrito = carrito.find(item => item.id === producto.id);
        if (!existeEnCarrito) {
            // Asegúrate de incluir la cantidad y la URL de descarga
            producto.quantity = 1;
            carrito.push(producto);
            localStorage.setItem('cart', JSON.stringify(carrito));
            alert(`${producto.name} agregado al carrito.`);
        } else {
            alert(`${producto.name} ya está en tu carrito.`);
        }
    }

    const buyButtons = document.querySelectorAll('.buy-button');

    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            const card = e.target.closest('.product-card');
            const productName = card.querySelector('h3').innerText;

            const productos = {
                'Plantilla "CyberNegocios"': {
                    id: 'cyber-negocios',
                    name: 'Plantilla "CyberNegocios"',
                    image: 'https://via.placeholder.com/400x300.png?text=Plantilla+Negocio',
                    price: 1000.00,
                    downloadUrl: '/descargas/plantilla-ciber-negocios.zip'
                },
                'Plantilla "Servicios Express"': {
                    id: 'servicios-express',
                    name: 'Plantilla "Servicios Express"',
                    image: 'https://via.placeholder.com/400x300.png?text=Plantilla+Servicios',
                    price: 900.00,
                    downloadUrl: '/descargas/plantilla-servicios-express.zip'
                }
            };

            const productoSeleccionado = productos[productName];

            if (productoSeleccionado) {
                agregarAlCarrito(productoSeleccionado);
            }
        });
    });
});