document.addEventListener('DOMContentLoaded', () => {

    // Lógica del Carrusel
    const carouselTrack = document.querySelector('.carousel-track');
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const images = document.querySelectorAll('.carousel-image');
    let currentIndex = 0;

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateCarousel();
    });

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateCarousel();
    });

    function updateCarousel() {
        const imageWidth = images[0].offsetWidth;
        carouselTrack.style.transform = `translateX(-${imageWidth * currentIndex}px)`;
    }
    
    // Lógica del Formulario de Agendamiento
    const bookingForm = document.getElementById('booking-form');
    const bookingModal = document.getElementById('booking-modal');
    const modalService = document.getElementById('modal-service');
    const modalDate = document.getElementById('modal-date');
    const modalTime = document.getElementById('modal-time');
    const closeModalBtn = document.querySelector('.modal .close-btn');

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const service = document.getElementById('service').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;

        // Validar que se haya seleccionado un servicio
        if (!service) {
            alert('Por favor, selecciona un servicio.');
            return;
        }

        // Simular el envío de la cita
        modalService.textContent = service;
        modalDate.textContent = date;
        modalTime.textContent = time;
        
        bookingModal.style.display = 'flex';
        bookingForm.reset();
    });

    closeModalBtn.addEventListener('click', () => {
        bookingModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            bookingModal.style.display = 'none';
        }
    });

    // Desplazamiento suave para la navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

});