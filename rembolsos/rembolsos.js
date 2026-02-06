document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.refund-form');
    const formMessage = document.getElementById('formMessage');

    form.addEventListener('submit', function(event) {
        // Validación simple: verificar que los campos críticos no estén vacíos.
        const orderNumber = document.getElementById('orderNumber').value;
        const email = document.getElementById('email').value;
        const refundReason = document.getElementById('refundReason').value;

        // Comprobamos si los campos requeridos están llenos (además de la validación 'required' de HTML)
        if (orderNumber.trim() === '' || email.trim() === '' || refundReason.trim() === '') {
             event.preventDefault(); // Si hay error, detenemos el envío.
             showMessage('🛑 Por favor, complete todos los campos obligatorios para enviar su solicitud.', 'error');
            return;
        }

        // Si la validación en JS es exitosa, NO llamamos a event.preventDefault(),
        // permitiendo que el formulario se envíe a Formsubmit (URL en el action del HTML).
        
        // Ocultamos el mensaje de error si existía y mostramos un mensaje temporal de "Enviando"
        // (Aunque Formsubmit redireccionará a la página de "Gracias")
        showMessage('🚀 Enviando su solicitud...', 'success');
        
        // El envío real a tu correo se realiza ahora por Formsubmit.
    });

    /**
     * Muestra un mensaje de feedback al usuario
     * @param {string} message - El mensaje a mostrar.
     * @param {string} type - 'success' o 'error' para aplicar estilos.
     */
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';

        // Ocultar el mensaje después de 5 segundos
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000); 
    }
});