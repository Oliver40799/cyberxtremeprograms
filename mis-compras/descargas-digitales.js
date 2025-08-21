document.addEventListener('DOMContentLoaded', () => {
    const historyContainer = document.getElementById('purchase-history-container');

    function showNotification(message) {
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.className = 'notification-bar';
            document.body.appendChild(notification);
        }
        notification.textContent = message;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    function getPurchaseHistory() {
        return JSON.parse(localStorage.getItem('purchaseHistory')) || [];
    }

    function renderPurchaseHistory() {
        const purchaseHistory = getPurchaseHistory();
        
        if (purchaseHistory.length === 0) {
            historyContainer.innerHTML = '<p>No has realizado ninguna compra.</p>';
            return;
        }

        historyContainer.innerHTML = '';
        purchaseHistory.forEach((item, index) => {
            const purchaseItem = document.createElement('div');
            purchaseItem.classList.add('purchase-item');

            const downloadsLeft = item.downloadsLeft !== undefined ? item.downloadsLeft : (item.quantity || 1);
            
            const itemHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Precio: $${(item.price * item.quantity).toFixed(2)} MXN</p>
                    <p>Fecha de compra: ${new Date(item.purchaseDate).toLocaleDateString()}</p>
                    <p>Cantidad: ${item.quantity || 1}</p>
                    <p>Descargas restantes: ${downloadsLeft}</p>
                </div>
                ${downloadsLeft > 0 
                    ? `<button class="download-button" data-id="${item.id}" data-index="${index}">Descargar Archivo</button>` 
                    : '<button class="download-button" disabled>Descargas agotadas</button>'
                }
            `;
            
            purchaseItem.innerHTML = itemHTML;
            historyContainer.appendChild(purchaseItem);
        });
    }
    
    historyContainer.addEventListener('click', (e) => {
        const downloadButton = e.target.closest('.download-button');
        if (downloadButton) {
            const productIndex = downloadButton.dataset.index;
            
            let purchaseHistory = getPurchaseHistory();
            const product = purchaseHistory[productIndex];
            
            if (product && product.downloadsLeft > 0) {
                // Simula la descarga
                window.location.href = product.downloadUrl;
                
                // Disminuye el contador de descargas
                product.downloadsLeft--;
                localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
                
                // Vuelve a renderizar la página para que el contador se actualice
                renderPurchaseHistory();
            } else {
                showNotification('Ya has descargado todas las copias de este archivo.');
            }
        }
    });

    renderPurchaseHistory();
});