document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');

    if (productList) {
        productList.addEventListener('click', (e) => {
            const addToCartBtn = e.target.closest('.add-to-cart-btn');

            if (addToCartBtn) {
                const product = {
                    id: addToCartBtn.dataset.id,
                    name: addToCartBtn.dataset.name,
                    price: parseFloat(addToCartBtn.dataset.price),
                    image: addToCartBtn.dataset.image,
                    isDigital: true, // Asumimos que las plantillas son digitales
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
                alert(`"${product.name}" ha sido añadido al carrito.`);
            }
        });
    }
});