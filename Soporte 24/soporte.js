document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const optionsContainer = document.getElementById('options-container');

    const botResponses = {
        'start': {
            message: 'Hola, soy el asistente virtual de CyberXtreme Programs. ¿En qué puedo ayudarte hoy?',
            options: [
                { text: 'Preguntas sobre productos', next: 'products' },
                { text: 'Soporte técnico', next: 'tech' },
                { text: 'Pedidos, descargas o reembolsos', next: 'orders' },
                { text: 'Hablar con un agente humano', next: 'human' }
            ]
        },
        'products': {
            message: 'Claro, ¿qué tipo de producto te interesa?',
            options: [
                { text: 'Plantillas web', next: 'web-templates' },
                { text: 'Software de diseño', next: 'design-software' },
                { text: 'Software de desarrollo', next: 'dev-software' },
                { text: 'Volver al inicio', next: 'start' }
            ]
        },
        'tech': {
            message: 'Para soporte técnico, te recomiendo revisar nuestra sección de preguntas frecuentes o contactarnos directamente en cyberxtremeprograms@gmail.com',
            options: [
                { text: 'Volver al inicio', next: 'start' }
            ]
        },
        'orders': {
            message: '¿Qué tipo de ayuda necesitás sobre tus pedidos?',
            options: [
                { text: 'Estado de mi pedido', next: 'order-status' },
                { text: 'Problemas con descargas', next: 'download-issue' },
                { text: 'Reembolsos o devoluciones', next: 'refunds' },
                { text: 'Volver al inicio', next: 'start' }
            ]
        },
        'order-status': {
            message: 'Podés revisar el estado de tus pedidos en la sección "Mis Compras" dentro de tu cuenta. Si algo no aparece, contactá a soporte con tu número de pedido.',
            options: [
                { text: 'Volver al inicio', next: 'start' }
            ]
        },
        'refunds': {
            message: 'Lamentamos que hayas tenido un inconveniente. Para procesar un reembolso o devolución, por favor asegúrate de cumplir con las siguientes condiciones:\n\n• La solicitud debe realizarse dentro de los primeros 7 días desde la compra.\n• El producto no debe haber sido activado o descargado más de una vez.\n• Deberás enviar el número de pedido y el motivo del reembolso a nuestro correo: cyberxtremeprograms@gamil.com\n\n¿Querés que te redirija al formulario de reembolso?',
            options: [
                { text: 'Sí, quiero solicitar un reembolso', next: 'redirect-refund' },
                { text: 'No, volver al inicio', next: 'start' }
            ]
        },
        'redirect-refund': {
            message: 'Redirigiendo al formulario de reembolsos...',
            options: [],
            action: () => {
                setTimeout(() => {
                    window.location.href = '/rembolsos/rembolsos.html'; // Asegúrate de crear o usar esta ruta
                }, 1500);
            }
        },
        'human': {
            message: 'Un momento, por favor. Serás redirigido a una página para contactar a un agente humano.',
            options: [
                { text: 'Continuar', next: 'redirect-contact' }
            ]
        },
        'web-templates': {
            message: '¿Tienes problemas para descargar una plantilla o necesitas más detalles sobre una?',
            options: [
                { text: 'Problema con la descarga', next: 'download-issue' },
                { text: 'Necesito más detalles', next: 'more-details' },
                { text: 'Volver', next: 'products' }
            ]
        },
        'download-issue': {
            message: 'Por favor, asegúrate de haber completado la compra y revisa tu correo electrónico para el enlace de descarga. Si el problema continúa, por favor, envíanos un email con tu número de pedido.',
            options: [
                { text: 'Volver al inicio', next: 'start' }
            ]
        },
        'more-details': {
            message: 'Puedes encontrar información detallada en la página de cada producto. Solo tienes que hacer clic en el producto que te interesa.',
            options: [
                { text: 'Volver al inicio', next: 'start' }
            ]
        },
        'design-software': {
            message: 'Actualmente, nuestro software de diseño está en desarrollo. ¡Mantente atento a las actualizaciones!',
            options: [
                { text: 'Volver al inicio', next: 'start' }
            ]
        },
        'dev-software': {
            message: 'Estamos trabajando en nuevas herramientas para desarrolladores. Visita nuestra sección de "Próximamente" para más información.',
            options: [
                { text: 'Volver al inicio', next: 'start' }
            ]
        },
        'redirect-contact': {
            message: 'Redirigiendo...',
            options: [],
            action: () => {
                setTimeout(() => {
                    window.location.href = '/contacto/contacto.html';
                }, 1500);
            }
        }
    };

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function showOptions(options) {
        optionsContainer.innerHTML = '';
        if (options.length > 0) {
            options.forEach(option => {
                const button = document.createElement('button');
                button.classList.add('option-button');
                button.textContent = option.text;
                button.addEventListener('click', () => {
                    handleUserResponse(option.text, option.next);
                });
                optionsContainer.appendChild(button);
            });
        }
    }

    function handleUserResponse(userText, nextState) {
        addMessage(userText, 'user');
        setTimeout(() => {
            const response = botResponses[nextState];
            addMessage(response.message, 'bot');
            showOptions(response.options);
            if (response.action) response.action();
        }, 500);
    }

    addMessage(botResponses.start.message, 'bot');
    showOptions(botResponses.start.options);
});
