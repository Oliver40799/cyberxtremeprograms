document.addEventListener('DOMContentLoaded', () => {

    // Datos del Menú (Simulación)
    const menuItems = [
        { name: 'Ensalada de Quinoa', category: 'entradas', price: '$8.50', image: 'https://via.placeholder.com/300x200/eee?text=Ensalada' },
        { name: 'Pasta Fresca', category: 'platos', price: '$15.00', image: 'https://via.placeholder.com/300x200/ddd?text=Pasta' },
        { name: 'Tarta de Chocolate', category: 'postres', price: '$7.00', image: 'https://via.placeholder.com/300x200/ccc?text=Tarta' },
        { name: 'Sopa del Día', category: 'entradas', price: '$6.00', image: 'https://via.placeholder.com/300x200/bbb?text=Sopa' },
        { name: 'Salmón a la Plancha', category: 'platos', price: '$22.00', image: 'https://via.placeholder.com/300x200/aaa?text=Salmón' },
    ];

    const menuGrid = document.querySelector('.menu-grid');
    const filterButtons = document.querySelectorAll('.menu-filter-btn');

    function renderMenu(category = 'all') {
        menuGrid.innerHTML = '';
        const itemsToShow = category === 'all' ? menuItems : menuItems.filter(item => item.category === category);
        
        itemsToShow.forEach(item => {
            const menuItemHTML = `
                <div class="menu-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="menu-item-info">
                        <h3>${item.name}</h3>
                        <p class="price">${item.price}</p>
                    </div>
                </div>
            `;
            menuGrid.insertAdjacentHTML('beforeend', menuItemHTML);
        });
    }

    // Lógica para el menú interactivo
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.dataset.category;
            renderMenu(category);
        });
    });

    // Lógica para el formulario de reservas
    const reservationForm = document.getElementById('reservation-form');
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;

        alert(`¡Reserva confirmada! ${name}, hemos reservado tu mesa para el ${date} a las ${time}. ¡Te esperamos!`);
        reservationForm.reset();
    });

    // Lógica para la galería (Modal)
    const galleryModal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('modal-image');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const closeBtn = document.querySelector('.close-modal-btn');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            galleryModal.style.display = 'block';
            modalImage.src = item.dataset.image;
        });
    });

    closeBtn.addEventListener('click', () => {
        galleryModal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === galleryModal) {
            galleryModal.style.display = 'none';
        }
    });

    renderMenu(); // Carga el menú inicial al cargar la página
});