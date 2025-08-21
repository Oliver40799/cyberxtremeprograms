document.addEventListener('DOMContentLoaded', () => {
    const historyListContainer = document.getElementById('history-list');

    // Esta es una lista de productos de ejemplo. En un proyecto real, se obtendrían de una base de datos.
    const products = [
        { id: "product-1", name: "Diseño Web Avanzado", price: 5500, image: "/Imagenes/pagina_web_ejemplo1.jpg" },
        { id: "product-2", name: "Tienda en Línea Completa", price: 9000, image: "/Imagenes/pagina_web_ejemplo2.png" },
        { id: "product-3", name: "Landing Page Personalizada", price: 3200, image: "/Imagenes/pagina_web_ejemplo3.jpg" }
    ];

    function renderHistory() {
        const historyIds = JSON.parse(localStorage.getItem('history')) || [];
        
        historyListContainer.innerHTML = ''; // Limpia el contenedor

        if (historyIds.length === 0) {
            historyListContainer.innerHTML = '<p>No has visto ningún producto todavía.</p>';
            document.getElementById('clear-history-button').style.display = 'none';
            return;
        }

        const uniqueHistoryIds = [...new Set(historyIds)].reverse();

        uniqueHistoryIds.forEach(productId => {
            const product = products.find(p => p.id === productId);
            if (product) {
                const productCard = document.createElement('div');
                productCard.classList.add('history-card');
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)} MXN</p>
                `;
                historyListContainer.appendChild(productCard);
            }
        });

        document.getElementById('clear-history-button').style.display = 'block';
    }

    // Funcionalidad para limpiar el historial
    const clearButton = document.getElementById('clear-history-button');
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            const confirmClear = confirm("¿Estás seguro de que quieres limpiar tu historial de visualización?");
            if (confirmClear) {
                localStorage.removeItem('history');
                renderHistory();
            }
        });
    }

    // Llama a la función para renderizar el historial al cargar la página
    if (window.location.pathname.endsWith('historial.html')) {
        renderHistory();
    }
});