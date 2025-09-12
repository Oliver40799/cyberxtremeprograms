document.addEventListener('DOMContentLoaded', () => {

    // Páginas y elementos principales
    const tabButtons = document.querySelectorAll('.tab-btn');
    const calculatorContainers = document.querySelectorAll('.calculator-container');
    const articlesGrid = document.getElementById('articles-grid');
    const loginBtn = document.querySelector('.login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeModalBtn = loginModal.querySelector('.close-btn');

    // Calculadora de Préstamos
    const loanAmountInput = document.getElementById('loan-amount');
    const loanInterestInput = document.getElementById('loan-interest');
    const loanTermInput = document.getElementById('loan-term');
    const calculateLoanBtn = document.getElementById('calculate-loan-btn');
    const loanResultDiv = document.getElementById('loan-result');

    // Calculadora de Inversiones
    const initialInvestmentInput = document.getElementById('initial-investment');
    const monthlyContributionInput = document.getElementById('monthly-contribution');
    const investmentReturnInput = document.getElementById('investment-return');
    const investmentTermInput = document.getElementById('investment-term');
    const calculateInvestmentBtn = document.getElementById('calculate-investment-btn');
    const investmentResultDiv = document.getElementById('investment-result');

    // Simulación de "base de datos" para artículos
    const articles = [
        {
            title: '5 Pasos para Organizar tus Finanzas Personales',
            image: 'https://via.placeholder.com/600x400/3498db/fff?text=Organiza+tus+Finanzas',
            excerpt: 'Descubre cómo crear un presupuesto, ahorrar de forma inteligente y eliminar deudas para tomar el control de tu dinero.'
        },
        {
            title: 'Guía Rápida para Principiantes en Inversiones',
            image: 'https://via.placeholder.com/600x400/2ecc71/fff?text=Invierte+con+éxito',
            excerpt: 'Conoce los conceptos básicos del mundo de las inversiones, desde fondos de inversión hasta acciones, y cómo empezar con poco dinero.'
        },
        {
            title: 'El Secreto para un Fondo de Emergencia Sólido',
            image: 'https://via.placeholder.com/600x400/f1c40f/fff?text=Fondo+de+Emergencia',
            excerpt: 'Aprende por qué es vital tener un fondo de emergencia y las mejores estrategias para construirlo de manera rápida y efectiva.'
        }
    ];

    // Lógica para cambiar de pestaña en calculadoras
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover la clase 'active' de todos los botones y contenedores
            tabButtons.forEach(tab => tab.classList.remove('active'));
            calculatorContainers.forEach(calc => calc.classList.add('hidden'));

            // Agregar la clase 'active' al botón y contenedor correctos
            const targetTab = btn.dataset.tab;
            btn.classList.add('active');
            document.getElementById(targetTab).classList.remove('hidden');
        });
    });

    // Lógica de las calculadoras
    // Préstamos
    calculateLoanBtn.addEventListener('click', () => {
        const amount = parseFloat(loanAmountInput.value);
        const interestRate = parseFloat(loanInterestInput.value) / 100 / 12; // Tasa mensual
        const termMonths = parseFloat(loanTermInput.value) * 12; // Plazo en meses

        if (amount <= 0 || interestRate <= 0 || termMonths <= 0) {
            loanResultDiv.textContent = "Por favor, ingresa valores válidos.";
            return;
        }

        const monthlyPayment = (amount * interestRate) / (1 - Math.pow(1 + interestRate, -termMonths));
        const totalPayment = monthlyPayment * termMonths;
        const totalInterest = totalPayment - amount;

        loanResultDiv.innerHTML = `
            <p><strong>Pago Mensual:</strong> $${monthlyPayment.toFixed(2)}</p>
            <p><strong>Interés Total:</strong> $${totalInterest.toFixed(2)}</p>
            <p><strong>Costo Total:</strong> $${totalPayment.toFixed(2)}</p>
        `;
    });

    // Inversiones
    calculateInvestmentBtn.addEventListener('click', () => {
        const initial = parseFloat(initialInvestmentInput.value);
        const monthly = parseFloat(monthlyContributionInput.value);
        const annualReturn = parseFloat(investmentReturnInput.value) / 100;
        const years = parseFloat(investmentTermInput.value);

        const monthlyReturn = annualReturn / 12;
        const totalMonths = years * 12;

        let futureValue = initial;
        for (let i = 0; i < totalMonths; i++) {
            futureValue = (futureValue + monthly) * (1 + monthlyReturn);
        }

        const totalContribution = initial + (monthly * totalMonths);
        const totalInterest = futureValue - totalContribution;
        
        investmentResultDiv.innerHTML = `
            <p><strong>Valor Final Estimado:</strong> $${futureValue.toFixed(2)}</p>
            <p><strong>Intereses Ganados:</strong> $${totalInterest.toFixed(2)}</p>
        `;
    });

    // Lógica de los artículos
    function renderArticles() {
        articlesGrid.innerHTML = articles.map(article => `
            <div class="article-card">
                <img src="${article.image}" alt="${article.title}">
                <div class="article-content">
                    <h3>${article.title}</h3>
                    <p>${article.excerpt}</p>
                    <a href="#">Leer más <i class="fa-solid fa-arrow-right"></i></a>
                </div>
            </div>
        `).join('');
    }

    // Lógica del modal de inicio de sesión
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.add('visible');
    });

    closeModalBtn.addEventListener('click', () => {
        loginModal.classList.remove('visible');
    });

    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('visible');
        }
    });

    // Simular el inicio de sesión (solo para demostración)
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Inicio de sesión exitoso. ¡Bienvenido a la zona de miembros!');
        loginModal.classList.remove('visible');
    });
    
    // Inicializar
    renderArticles();
});