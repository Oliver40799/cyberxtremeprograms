document.addEventListener('DOMContentLoaded', () => {

    // Lógica para el portafolio interactivo (filtrado)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Elimina la clase 'active' de todos los botones y la añade al clicado
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;
            
            portfolioItems.forEach(item => {
                const category = item.dataset.category;
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block'; // Muestra el elemento
                } else {
                    item.style.display = 'none'; // Oculta el elemento
                }
            });
        });
    });

    // Lógica para el formulario de cotización avanzado
    const quoteForm = document.getElementById('quote-form');

    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que la página se recargue

        // Recopila los datos del formulario
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const service = document.getElementById('service-select').value;
        const budget = document.getElementById('budget').value;
        const message = document.getElementById('message').value;

        // Muestra un resumen de la cotización
        const quoteSummary = `
            Resumen de Cotización:
            Nombre: ${name}
            Correo: ${email}
            Servicio: ${service}
            Presupuesto: ${budget}
            Mensaje: ${message}
        `;

        alert('¡Tu cotización ha sido enviada con éxito! En breve nos pondremos en contacto contigo.\n\n' + quoteSummary);

        // Puedes resetear el formulario si lo deseas
        quoteForm.reset();
    });

});