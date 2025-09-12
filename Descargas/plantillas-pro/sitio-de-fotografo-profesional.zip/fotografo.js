document.addEventListener('DOMContentLoaded', () => {

    // Lógica para la galería protegida con contraseña
    const passwordForm = document.getElementById('password-form');
    const galleryContainer = document.querySelector('.client-gallery-container');
    const passwordInput = document.getElementById('gallery-password');
    const correctPassword = 'foto123'; // Contraseña de ejemplo

    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (passwordInput.value === correctPassword) {
            galleryContainer.classList.remove('hidden');
            passwordForm.style.display = 'none';
            alert('¡Contraseña correcta! Galería desbloqueada.');
        } else {
            alert('Contraseña incorrecta. Intenta de nuevo.');
            passwordInput.value = '';
        }
    });

    // Lógica para el sistema de pedidos de impresiones
    const orderModal = document.getElementById('order-modal');
    const closeBtn = document.querySelector('.close-btn');
    const orderButtons = document.querySelectorAll('.order-print-btn');
    const orderForm = document.getElementById('order-form');
    const photoUrlInput = document.getElementById('photo-url');

    orderButtons.forEach(button => {
        button.addEventListener('click', () => {
            const imageUrl = button.closest('.gallery-image-item').dataset.image;
            photoUrlInput.value = imageUrl;
            orderModal.style.display = 'flex';
        });
    });

    closeBtn.addEventListener('click', () => {
        orderModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === orderModal) {
            orderModal.style.display = 'none';
        }
    });

    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const size = document.getElementById('size-select').value;
        const quantity = document.getElementById('quantity').value;
        const photoUrl = photoUrlInput.value;

        alert(`¡Pedido de impresión confirmado!
        Tamaño: ${size}
        Cantidad: ${quantity}
        Foto: ${photoUrl}
        Nos pondremos en contacto contigo para los detalles de pago.`);

        orderModal.style.display = 'none';
        orderForm.reset();
    });

});