document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const optionsContainer = document.getElementById('options-container');

    const botResponses = {
        'start': {
            message: 'Hola, soy el asistente virtual de CyberXtreme Programs. ¿En qué puedo ayudarte hoy?',
            options: [
                { text: 'Preguntas sobre productos', next: 'products' },
                { text: 'Soporte técnico', next: 'tech' },
                { text: 'Información sobre pedidos o descargas', next: 'orders' },
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
            message: 'Para soporte técnico, te recomiendo revisar nuestra sección de preguntas frecuentes o contactarnos directamente en soporte@cyberxtreme.com',
            options: [
                { text: 'Volver al inicio', next: 'start' }
            ]
        },
        'orders': {
            message: 'Para información de pedidos o descargas, por favor revisa tu historial de compras en tu perfil. Si el problema persiste, contacta a nuestro equipo de ventas.',
            options: [
                { text: 'Volver al inicio', next: 'start' }
            ]
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
                    window.location.href = '/contacto/contacto.html'; // Asegúrate de que esta ruta sea correcta
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
        
        // Simula la espera del bot
        setTimeout(() => {
            const response = botResponses[nextState];
            addMessage(response.message, 'bot');
            showOptions(response.options);

            if (response.action) {
                response.action(); // Ejecuta la acción de redirección si existe
            }
        }, 500);
    }

    // Iniciar la conversación
    addMessage(botResponses.start.message, 'bot');
    showOptions(botResponses.start.options);
});