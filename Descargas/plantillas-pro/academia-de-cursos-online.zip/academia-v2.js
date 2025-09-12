document.addEventListener('DOMContentLoaded', () => {

    const courseCards = document.querySelectorAll('.course-card');
    const courseModal = document.getElementById('course-modal');
    const modalContentArea = document.getElementById('modal-content-area');
    const closeBtn = document.querySelector('#course-modal .close-btn');
    const loginNavLink = document.getElementById('login-nav-link');

    let loggedIn = false;
    let currentUser = null;

    // Simulación de "base de datos"
    const courses = {
        1: { id: 1, title: 'Curso de Diseño Gráfico', instructor: 'Ana Torres', price: 89, description: 'Aprende los fundamentos del diseño gráfico, desde la teoría del color hasta el uso de software profesional.', enrolled: false },
        2: { id: 2, title: 'Programación con Python', instructor: 'Juan Pérez', price: 129, description: 'Un curso completo para aprender Python, desde los conceptos básicos hasta proyectos avanzados.', enrolled: false },
        3: { id: 3, title: 'Fotografía Profesional', instructor: 'Carlos Romero', price: 75, description: 'Domina tu cámara y aprende a tomar fotos increíbles en cualquier situación.', enrolled: false }
    };

    // Lógica del Carrusel
    const carouselTrack = document.querySelector('.carousel-track');
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    let currentIndex = 0;

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % carouselTrack.children.length;
        updateCarousel();
    });

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + carouselTrack.children.length) % carouselTrack.children.length;
        updateCarousel();
    });

    function updateCarousel() {
        const testimonialWidth = carouselTrack.children[0].offsetWidth;
        carouselTrack.style.transform = `translateX(-${testimonialWidth * currentIndex}px)`;
    }
    
    // Lógica de Modales y Cursos
    courseCards.forEach(card => {
        card.addEventListener('click', () => {
            const courseId = card.dataset.courseId;
            openCourseModal(courseId);
        });
    });
    
    closeBtn.addEventListener('click', () => {
        courseModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === courseModal) {
            courseModal.style.display = 'none';
        }
    });

    loginNavLink.addEventListener('click', (e) => {
        e.preventDefault();
        openLoginModal();
    });
    
    function openCourseModal(courseId) {
        const course = courses[courseId];
        let content = '';

        if (!loggedIn) {
            // Contenido para usuario no logeado
            content = `
                <div class="modal-course-details">
                    <h3>${course.title}</h3>
                    <p><strong>Instructor:</strong> ${course.instructor}</p>
                    <p>${course.description}</p>
                    <p class="course-price">$${course.price}</p>
                    <button class="buy-course-btn">Comprar Curso</button>
                    <a href="#" id="modal-login-link">Iniciar Sesión para comprar</a>
                </div>
            `;
        } else if (course.enrolled) {
            // Contenido para usuario logeado e inscrito
            content = `
                <div class="modal-course-details">
                    <h3>¡Bienvenido a ${course.title}!</h3>
                    <p><strong>Instructor:</strong> ${course.instructor}</p>
                    <p>Contenido exclusivo de las lecciones...</p>
                    <button class="start-course-btn">Comenzar Curso</button>
                </div>
            `;
        } else {
             // Contenido para usuario logeado pero no inscrito
            content = `
                <div class="modal-course-details">
                    <h3>${course.title}</h3>
                    <p><strong>Instructor:</strong> ${course.instructor}</p>
                    <p>${course.description}</p>
                    <p class="course-price">$${course.price}</p>
                    <button class="buy-course-btn" data-course-id="${courseId}">Comprar Ahora</button>
                </div>
            `;
        }

        modalContentArea.innerHTML = content;
        courseModal.style.display = 'flex';
        
        // Asignar eventos a los botones recién creados
        const buyBtn = document.querySelector('.buy-course-btn');
        if (buyBtn) {
            buyBtn.addEventListener('click', () => {
                // Simulación de pago
                alert(`Simulando compra del curso: ${course.title}`);
                course.enrolled = true;
                courseModal.style.display = 'none';
            });
        }
        
        const startBtn = document.querySelector('.start-course-btn');
        if (startBtn) {
             startBtn.addEventListener('click', () => {
                alert(`Iniciando curso: ${course.title}`);
                courseModal.style.display = 'none';
            });
        }
        
        const modalLoginLink = document.getElementById('modal-login-link');
        if (modalLoginLink) {
            modalLoginLink.addEventListener('click', (e) => {
                e.preventDefault();
                courseModal.style.display = 'none';
                openLoginModal();
            });
        }
    }
    
    function openLoginModal() {
        modalContentArea.innerHTML = `
            <h3>Iniciar Sesión</h3>
            <form id="login-form" class="modal-form">
                <input type="email" placeholder="Correo electrónico" required>
                <button type="submit">Acceder</button>
            </form>
        `;
        courseModal.style.display = 'flex';

        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input').value;
            loggedIn = true;
            currentUser = { email: email };
            alert(`¡Bienvenido, ${email}!`);
            courseModal.style.display = 'none';
            
            // Actualizar el estado de la UI
            loginNavLink.textContent = 'Mi Perfil';
            loginNavLink.href = '#'; // Cambiar a la sección de perfil si existiera
        });
    }

});