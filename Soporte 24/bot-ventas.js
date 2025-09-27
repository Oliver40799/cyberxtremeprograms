document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const optionsContainer = document.getElementById('options-container');

    const botResponses = {
        'start': {
            message: '¡Hola! Soy el asistente virtual de CyberXtreme. ¿En qué estás interesado hoy?',
            options: [
                { text: 'Cotizaciones', next: 'quote' },
                { text: 'Licencias y permisos', next: 'licenses' },
                { text: 'Asesoría para mi negocio', next: 'business-advice' },
                { text: 'Promociones', next: 'promotions' },
                { text: 'Productos destacados', next: 'featured-products' },
                { text: 'Métodos de pago', next: 'payment-methods' },
                { text: 'Soporte técnico', next: 'technical-support' },
                { text: 'Envíos y devoluciones', next: 'shipping-returns' },
                { text: 'Sobre CyberXtreme', next: 'about-us' },
                { text: 'Programas y software', next: 'software-info' }
            ]
        },

        // Cotizaciones
        'quote': {
            message: '¡Genial! Nosotros creamos webs desde 1,000 hasta 10,000 pesos según el diseño y funcionalidades que necesites. ¿Qué tipo de web te interesa?',
            options: [
                { text: 'Diseño web simple', next: 'quote-web' },
                { text: 'Software a medida', next: 'quote-software' },
                { text: 'Suscripciones CyberPro+', next: 'quote-subscriptions' },
                { text: 'Volver al inicio', next: 'start' }
            ]
        },
        'quote-web': { message: 'Ofrecemos paquetes de diseño web desde landing pages hasta tiendas completas.', options: [
            { text: 'Volver a cotizaciones', next: 'quote' },
            { text: 'Volver al inicio', next: 'start' }
        ]},
        'quote-software': { message: 'El costo de un software depende de sus funcionalidades. Contacta un agente para más info.', options: [
            { text: 'Contactar a un agente', next: 'redirect-contact' },
            { text: 'Volver al inicio', next: 'start' }
        ]},
        'quote-subscriptions': { message: 'Las suscripciones CyberPro+ incluyen plantillas y descuentos exclusivos.', options: [
            { text: 'Ver suscripciones', next: 'redirect-subscriptions' },
            { text: 'Volver a cotizaciones', next: 'quote' }
        ]},

        // Licencias
        'licenses': { message: 'Toda la información sobre licencias y permisos está en "Términos y condiciones".', options: [
            { text: 'Ver términos y condiciones', next: 'redirect-terms' },
            { text: 'Volver al inicio', next: 'start' }
        ]},

        // Asesoría
        'business-advice': { message: 'Para asesoría personalizada, agenda una llamada con nuestro equipo de expertos.', options: [
            { text: 'Agendar llamada', next: 'redirect-contact' },
            { text: 'Volver al inicio', next: 'start' }
        ]},

        // Promociones
        'promotions': { message: '¡Este mes tenemos ofertas en PCs gamer y suscripciones! Revisá la página principal.', options: [
            { text: 'Volver al inicio', next: 'start' }
        ]},

        // Productos destacados
        'featured-products': { message: 'Nuestros productos más populares: PCs gamer, accesorios VR, y suscripciones CyberPro+.', options: [
            { text: 'Volver al inicio', next: 'start' }
        ]},

        // Métodos de pago
        'payment-methods': { message: 'Aceptamos tarjetas, PayPal, transferencias y pagos en Oxxo (México).', options: [
            { text: 'Volver al inicio', next: 'start' }
        ]},

        // Soporte técnico
        'technical-support': { message: 'Podés consultar tutoriales o contactarnos para asistencia personalizada.', options: [
            { text: 'Ver tutoriales', next: 'redirect-tutorials' },
            { text: 'Contactar soporte', next: 'redirect-contact' },
            { text: 'Volver al inicio', next: 'start' }
        ]},

        // Envíos y devoluciones
        'shipping-returns': { message: 'Hacemos envíos a todo México. Revisá nuestra política de devoluciones en Términos y condiciones.', options: [
            { text: 'Ver términos y condiciones', next: 'redirect-terms' },
            { text: 'Volver al inicio', next: 'start' }
        ]},

        // Sobre la empresa (reemplazado)
        'about-us': { 
            message: `📌 CyberXtreme Programs es una empresa dedicada a la tecnología gamer y las soluciones digitales.  
💻 Ofrecemos:  
- Plantillas web (Pro y próximamente Básicas).  
- Software a medida en desarrollo.  
- Suscripciones CyberPro+ con contenido exclusivo.  
🤝 Atención:  
- Chatbots de soporte y ventas.  
- Contacto directo con agentes.  
- Presencia en Facebook, Instagram y Discord.  
🔒 Seguridad y confianza en cada servicio.`, 
            options: [
                { text: 'Volver al inicio', next: 'start' }
            ]
        },

        // Programas y software
        'software-info': { message: 'Tenemos software a medida, utilidades para PC y suscripciones CyberPro+. Revisa la sección de productos.', options: [
            { text: 'Volver al inicio', next: 'start' }
        ]},

        // Redirecciones
        'redirect-contact': { message: 'Redirigiendo a contacto...', options: [], action: () => setTimeout(() => window.location.href='/contacto/contacto.html',1500) },
        'redirect-subscriptions': { message: 'Redirigiendo a suscripciones...', options: [], action: () => setTimeout(() => window.location.href='/Subscripciones/CyberPro+.html',1500) },
        'redirect-terms': { message: 'Redirigiendo a términos...', options: [], action: () => setTimeout(() => window.location.href='/Terminos/terminos.html',1500) },
        'redirect-tutorials': { message: 'Redirigiendo a tutoriales...', options: [], action: () => setTimeout(() => window.location.href='/tutoriales/tutoriales.html',1500) }
    };

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
    }

    function showOptions(options) {
        optionsContainer.innerHTML = '';
        if (options.length > 0) {
            options.forEach(option => {
                const button = document.createElement('button');
                button.classList.add('option-button');
                button.textContent = option.text;
                button.addEventListener('click', () => {
                    disableOptions();
                    handleUserResponse(option.text, option.next);
                });
                optionsContainer.appendChild(button);
            });
        }
    }

    function disableOptions() {
        const buttons = optionsContainer.querySelectorAll('button');
        buttons.forEach(btn => btn.disabled = true);
    }

    function handleUserResponse(userText, nextState) {
        addMessage(userText, 'user');
        setTimeout(() => {
            const response = botResponses[nextState];
            addMessage(response.message, 'bot');
            showOptions(response.options);
            if (response.action) response.action();
        }, 600);
    }

    // Iniciar conversación
    addMessage(botResponses.start.message, 'bot');
    showOptions(botResponses.start.options);
});
