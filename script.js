// =========================================================================
// Código para el Carrusel
// =========================================================================
let slideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.prev-button');
const nextBtn = document.querySelector('.next-button');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    if (slides[index]) slides[index].classList.add('active');
}

function nextSlide() {
    slideIndex++;
    if (slideIndex >= slides.length) slideIndex = 0;
    showSlide(slideIndex);
}

if (prevBtn) prevBtn.addEventListener('click', () => {
    slideIndex--;
    if (slideIndex < 0) slideIndex = slides.length - 1;
    showSlide(slideIndex);
});

if (nextBtn) nextBtn.addEventListener('click', () => nextSlide());
if (slides.length > 1) setInterval(nextSlide, 5000);

// =========================================================================
// Código principal
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {

    // Función para agregar al carrito
    // ⭐ CORREGIDA: Incluye limpieza de cadena (trim) y verificación de palabra clave (includes) ⭐
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let existing = cart.find(item => item.id === product.id);
        
        // 1. Garantizamos que la categoría exista en el producto antes de usarla
        product.category = product.category || 'General';

        // 2. Limpieza y Lógica para marcar productos de Software/Licencia
        const cleanedCategory = product.category.toLowerCase().trim();
        
        // Hacemos que la condición sea más flexible: ¿Contiene "software" o "licencia"?
        const isSoftware = cleanedCategory.includes('software') || cleanedCategory.includes('licencia');

        if (existing) {
            existing.quantity += 1;
        } else {
            product.quantity = 1;
            product.isDigital = product.isDigital || false;
            
            // ⭐ CAMPO CRÍTICO: Usamos la verificación más robusta
            product.isLicensed = isSoftware; 
            cart.push(product);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        showNotification('¡Producto añadido al carrito!');
    }

    // Muestra una notificación temporal
    function showNotification(message) {
        let notification = document.querySelector('.notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.classList.add('notification');
            document.body.appendChild(notification);
        }
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
    }
    
    // Función para guardar en el historial
    function saveToHistory(productId) {
        let history = JSON.parse(localStorage.getItem('history')) || [];
        history = history.filter(id => id !== productId);
        history.unshift(productId);
        history = history.slice(0, 50);
        localStorage.setItem('history', JSON.stringify(history));
    }

    // Escucha clics en los botones "Añadir al carrito"
    const addBtns = document.querySelectorAll('.add-to-cart-btn');
    addBtns.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            
            // Leemos el nuevo atributo data-category
            const category = btn.dataset.category || 'General';

            const product = {
                id: btn.dataset.id,
                name: btn.dataset.name,
                price: parseFloat(btn.dataset.price),
                image: btn.dataset.image,
                isDigital: btn.dataset.digital === "true", 
                category: category // Pasamos la categoría a la función addToCart
            };
            
            addToCart(product);
        });
    });

    // Escucha clics en las tarjetas de producto para historial
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', e => {
            if (!e.target.closest('.add-to-cart-btn')) {
                const productId = card.dataset.id;
                saveToHistory(productId);
                window.location.href = `producto.html?id=${productId}`;
            }
        });
    });

    // Barra de búsqueda
    const searchBar = document.querySelector('.search-bar input');
    if (searchBar) {
        searchBar.addEventListener('keyup', e => {
            const term = e.target.value.toLowerCase();
            productCards.forEach(product => {
                const name = product.querySelector('.product-name').textContent.toLowerCase();
                product.style.display = name.includes(term) ? 'block' : 'none';
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // FECHAS OBJETIVO (Ajustadas según tus parámetros de prueba)
    const navidadDate = new Date("Dec 25, 2025 00:00:00").getTime();
    const finNavidad = new Date("Dec 26, 2025 00:00:00").getTime(); 
    const añoNuevoDate = new Date("Jan 1, 2026 00:00:00").getTime();
    const finAñoNuevo = new Date("Jan 2, 2026 00:00:00").getTime();

    let animationInterval = null;

    const updateTimer = setInterval(() => {
        const now = new Date().getTime();
        
        const msgTitle = document.getElementById("christmas-msg");
        const timerContainer = document.getElementById("timer");
        const fullMsgContainer = document.getElementById("christmas-message-full");
        const logoEl = document.getElementById("main-logo");

        // --- 1. LÓGICA DE NAVIDAD ---
        if (now >= navidadDate && now < finNavidad) {
            if (timerContainer) timerContainer.style.display = "none";
            if (msgTitle) msgTitle.innerText = "¡FELIZ NAVIDAD! 🎁";
            
            if (fullMsgContainer && fullMsgContainer.style.display !== "block") {
                fullMsgContainer.style.display = "block";
                fullMsgContainer.innerHTML = `
                    <p style="font-weight: bold; color: #00FFFF; margin-bottom: 8px;">🎄 Feliz Navidad de parte de CyberXtreme Programs 🎄</p>
                    <p style="margin-bottom: 6px;">Hoy no solo celebramos la Navidad, celebramos las ideas que nacen, los proyectos que crecen y las metas que parecen imposibles… hasta que alguien decide ir por ellas.</p>
                    <p style="margin-bottom: 6px;">En <strong>CyberXtreme Programs</strong> creemos que la tecnología es una herramienta para crear, aprender, emprender y transformar sueños en realidad.</p>
                    <p style="margin-bottom: 6px;">Gracias por confiar en nosotros, por formar parte de esta comunidad y por apostar a un futuro más digital, más libre y más innovador.</p>
                    <p style="margin-bottom: 6px;">Que esta Navidad esté llena de paz, momentos reales, risas sinceras y nuevas ideas que valgan la pena construir.</p>
                    <p style="margin-bottom: 6px;">Disfrutá hoy, descansá, recargá energía… porque lo mejor todavía está por venir 🚀</p>
                    <p style="margin-top: 10px; font-style: italic; color: #00FFFF; border-top: 1px solid rgba(0,255,255,0.2); padding-top: 5px; font-size: 0.85em;">
                        — CyberXtreme Programs<br>Tecnología para los que van en serio.
                    </p>
                `;
                startFallingAnimation(['❄️', '❅', '❆', '🎁', '📦', '✨']);
            }

            if (logoEl && !logoEl.innerHTML.includes('🧑‍🎄')) {
                logoEl.innerHTML = 'CXP <span style="font-size: 0.8em; vertical-align: top;">🧑‍🎄</span>';
                logoEl.style.color = "#ff4d4d";
                logoEl.style.textShadow = "0 0 20px #ff0000";
            }
            return;
        }

        // --- 2. LÓGICA DE AÑO NUEVO ---
        if (now >= añoNuevoDate && now < finAñoNuevo) {
            if (timerContainer) timerContainer.style.display = "none";
            if (msgTitle) msgTitle.innerText = "¡FELIZ 2026! 🎆";
            
            if (fullMsgContainer && !fullMsgContainer.innerHTML.includes('construye')) {
                fullMsgContainer.style.display = "block";
                fullMsgContainer.innerHTML = `
                    <p style="font-weight: bold; color: #00FFFF; margin-bottom: 10px;">🎆 Feliz Año Nuevo 2026 🎆</p>
                    <p style="margin-bottom: 8px;">En CyberXtreme Programs creemos que el futuro no se espera: se construye.</p>
                    <p style="margin-bottom: 8px;">Este 2026 llega con una visión clara: darle a cualquiera la posibilidad de crear su propia tienda online sin límites, con libertad real y herramientas inteligentes que acompañan cada paso del proceso.</p>
                    
                    <p style="font-weight: bold; color: #00FFFF; margin-bottom: 5px;">Muy pronto vas a poder:</p>
                    <ul style="text-align: left; margin-bottom: 10px; padding-left: 20px; list-style-type: disc;">
                        <li>Crear tu tienda con IA asistida, desde la estructura hasta el diseño</li>
                        <li>Personalizar colores, secciones y estilo a tu manera</li>
                        <li>Acceder a planes de suscripción pensados para crecer, no para limitar</li>
                        <li>Usar tu propio dominio y publicar tu proyecto con total control</li>
                        <li>Modificar el diseño con HTML, CSS y JavaScript cuando quieras ir más allá</li>
                    </ul>

                    <p style="margin-bottom: 8px;">📅 <strong>El 3 de enero</strong> lanzamos la nueva actualización de nuestro software, marcando el inicio de una nueva etapa para CyberXtreme Programs y para todos los que quieren construir algo propio.</p>
                    <p style="margin-bottom: 8px;">Este año no se trata solo de empezar de cero, <strong>se trata de crear algo que valga la pena.</strong></p>
                    <p style="margin-bottom: 8px;">Gracias por ser parte de este camino.</p>
                    <p style="margin-bottom: 8px;">El 2026 recién empieza… y viene fuerte.</p>
                    <p style="margin-top: 15px; font-weight: bold; color: #00FFFF; border-top: 1px solid rgba(0,255,255,0.2); padding-top: 10px;">🚀 CyberXtreme Programs</p>
                `;
                startFallingAnimation(['🎆', '🚀', '🥂', '✨', '🎊', '🍾']);
            }

            // Quitar gorrito de navidad si sigue ahí
            if (logoEl && logoEl.innerHTML.includes('🧑‍🎄')) {
                logoEl.innerHTML = 'CXP';
                logoEl.style.color = "";
                logoEl.style.textShadow = "";
            }
            return;
        }

        // --- 3. LÓGICA DE LIMPIEZA (Entre eventos o al final) ---
        const isIntermedio = (now >= finNavidad && now < añoNuevoDate);
        const isPostFinal = (now >= finAñoNuevo);

        if (isIntermedio || isPostFinal) {
            // Detener animaciones
            if (animationInterval) {
                clearInterval(animationInterval);
                animationInterval = null;
            }
            // Limpiar mensajes y logo
            if (fullMsgContainer) fullMsgContainer.style.display = "none";
            if (logoEl) {
                logoEl.innerHTML = 'CXP';
                logoEl.style.color = "";
                logoEl.style.textShadow = "";
            }
        }

        // --- 4. LÓGICA DEL TEMPORIZADOR ---
        let targetDate;
        if (now < navidadDate) {
            targetDate = navidadDate;
            if (msgTitle) msgTitle.innerText = "Cuenta regresiva para Navidad";
        } else if (now >= finNavidad && now < añoNuevoDate) {
            targetDate = añoNuevoDate;
            if (msgTitle) msgTitle.innerText = "Cuenta regresiva para el 2026";
            if (timerContainer) timerContainer.style.display = "flex";
        } else {
            // Si ya terminó todo definitivamente
            if (msgTitle) msgTitle.innerText = "";
            if (timerContainer) timerContainer.style.display = "none";
            clearInterval(updateTimer);
            return;
        }

        const distance = targetDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (document.getElementById("days")) document.getElementById("days").innerText = days.toString().padStart(2, '0');
        if (document.getElementById("hours")) document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        if (document.getElementById("minutes")) document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        if (document.getElementById("seconds")) document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');

    }, 1000);

    function startFallingAnimation(items) {
        if (animationInterval) clearInterval(animationInterval);
        const createItem = () => {
            const item = document.createElement('div');
            item.className = 'falling-item';
            item.innerHTML = items[Math.floor(Math.random() * items.length)];
            item.style.left = Math.random() * 100 + 'vw';
            item.style.fontSize = (Math.random() * 20 + 20) + 'px';
            item.style.position = 'fixed';
            item.style.top = '-50px';
            item.style.zIndex = '9999';
            item.style.pointerEvents = 'none';
            document.body.appendChild(item);
            setTimeout(() => item.remove(), 5000);
        };
        animationInterval = setInterval(createItem, 300);
    }
});