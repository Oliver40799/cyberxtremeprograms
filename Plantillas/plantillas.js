// plantillas.js
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const product = {
                id: button.dataset.id,
                name: button.dataset.name,
                price: parseFloat(button.dataset.price),
                image: button.dataset.image,
                isDigital: true,
                quantity: 1
            };

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingProductIndex = cart.findIndex(item => item.id === product.id);

            if (existingProductIndex > -1) {
                cart[existingProductIndex].quantity += 1;
            } else {
                cart.push(product);
            }

            localStorage.setItem('cart', JSON.stringify(cart));

            // Toast abajo
            const toast = document.createElement('div');
            toast.textContent = `"${product.name}" ha sido añadido al carrito.`;
            toast.style = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #4caf50;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
            `;
            document.body.appendChild(toast);
            setTimeout(() => toast.style.opacity = 1, 10);
            setTimeout(() => {
                toast.style.opacity = 0;
                setTimeout(() => toast.remove(), 300);
            }, 2000);
        });
    });
});

