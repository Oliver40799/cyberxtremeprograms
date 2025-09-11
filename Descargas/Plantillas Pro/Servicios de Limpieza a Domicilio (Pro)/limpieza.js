document.addEventListener('DOMContentLoaded', () => {

    // Precios de referencia
    const precios = {
        byHour: 30, // Precio por hora
        deepClean: {
            base: 100, // Costo base por una limpieza profunda
            perBedroom: 25,
            perBathroom: 20
        }
    };

    // Elementos del DOM del formulario de agendamiento
    const bookingForm = document.getElementById('booking-form');
    const serviceTypeRadios = document.querySelectorAll('input[name="service-type"]');
    const hoursInput = document.getElementById('hours');
    const deepCleanDetails = document.getElementById('deep-clean-details');
    const bedroomsInput = document.getElementById('bedrooms');
    const bathroomsInput = document.getElementById('bathrooms');
    const summaryText = document.getElementById('summary-text');
    const summaryPriceSpan = document.querySelector('#summary-price span');

    // Elementos del DOM del formulario de cotización
    const quoteForm = document.getElementById('quote-form');

    // Función para actualizar el precio
    function updatePrice() {
        const serviceType = document.querySelector('input[name="service-type"]:checked').value;
        let total = 0;
        let summaryMessage = '';

        if (serviceType === 'by-hours') {
            const hours = parseFloat(hoursInput.value) || 0;
            total = hours * precios.byHour;
            summaryMessage = `Servicio de ${hours} hora${hours !== 1 ? 's' : ''}.`;
            // Mostrar/ocultar campos
            hoursInput.parentElement.classList.remove('hidden');
            deepCleanDetails.classList.add('hidden');
        } else if (serviceType === 'deep-clean') {
            const bedrooms = parseInt(bedroomsInput.value) || 0;
            const bathrooms = parseInt(bathroomsInput.value) || 0;
            total = precios.deepClean.base + (bedrooms * precios.deepClean.perBedroom) + (bathrooms * precios.deepClean.perBathroom);
            summaryMessage = `Limpieza profunda: ${bedrooms} habitación${bedrooms !== 1 ? 'es' : ''}, ${bathrooms} baño${bathrooms !== 1 ? 's' : ''}.`;
            // Mostrar/ocultar campos
            hoursInput.parentElement.classList.add('hidden');
            deepCleanDetails.classList.remove('hidden');
        }

        summaryText.textContent = summaryMessage;
        summaryPriceSpan.textContent = total.toFixed(2);
    }

    // Event listeners para actualizar el precio en tiempo real
    serviceTypeRadios.forEach(radio => radio.addEventListener('change', updatePrice));
    hoursInput.addEventListener('input', updatePrice);
    bedroomsInput.addEventListener('input', updatePrice);
    bathroomsInput.addEventListener('input', updatePrice);

    // Manejar el envío del formulario de agendamiento
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Validar que los campos de contacto no estén vacíos
        const fullName = document.getElementById('full-name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;

        if (!fullName || !phone || !email) {
            alert('Por favor, completa todos los campos de contacto.');
            return;
        }

        const bookingDetails = {
            serviceType: document.querySelector('input[name="service-type"]:checked').value,
            hours: hoursInput.value,
            bedrooms: bedroomsInput.value,
            bathrooms: bathroomsInput.value,
            totalPrice: summaryPriceSpan.textContent,
            name: fullName,
            phone: phone,
            email: email
        };

        console.log('Agendamiento:', bookingDetails);
        alert('¡Servicio agendado con éxito! Nos pondremos en contacto contigo para confirmar.');
        bookingForm.reset();
        // Resetear la vista y el precio después de enviar
        setTimeout(() => updatePrice(), 50); 
    });

    // Manejar el envío del formulario de cotización
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const quoteDetails = {
            name: document.getElementById('quote-name').value,
            email: document.getElementById('quote-email').value,
            description: document.getElementById('quote-details').value
        };
        console.log('Cotización a medida:', quoteDetails);
        alert('¡Solicitud de cotización enviada! Te responderemos a la brevedad.');
        quoteForm.reset();
    });

    // Inicializar el precio al cargar la página
    updatePrice();
});