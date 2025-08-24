document.addEventListener('DOMContentLoaded', () => {
    const historyContainer = document.getElementById('purchase-history-container');

    // Función para mostrar notificaciones
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
        setTimeout(() => notification.classList.remove('show'), 3000);
    }

    // Obtener historial de compras
    function getPurchaseHistory() {
        return JSON.parse(localStorage.getItem('purchaseHistory')) || [];
    }

    // Guardar historial de compras
    function savePurchaseHistory(history) {
        localStorage.setItem('purchaseHistory', JSON.stringify(history));
    }

    // Renderizar historial
    function renderPurchaseHistory() {
        const purchaseHistory = getPurchaseHistory();
        if (!historyContainer) return;

        if (purchaseHistory.length === 0) {
            historyContainer.innerHTML = '<p>No has realizado ninguna compra.</p>';
            return;
        }

        historyContainer.innerHTML = '';
        let grandTotal = 0;

        purchaseHistory.forEach((item, index) => {
            const purchaseItem = document.createElement('div');
            purchaseItem.classList.add('purchase-item');

            if (item.downloads === undefined) item.downloads = 0;
            const remainingDownloads = item.quantity - item.downloads;

            // Actualizar el link de descarga para que apunte a tu dominio
            let downloadLink = item.downloadLink;
            if (downloadLink && !downloadLink.startsWith('http')) {
                downloadLink = `https://cyberxtremeprograms.store/${downloadLink.replace(/^\//, '')}`;
            }

            const itemTotalPrice = item.price;
            grandTotal += itemTotalPrice;
            const formattedPrice = itemTotalPrice.toFixed(2);

            let downloadButtonHTML = '';
            if (downloadLink) {
                if (remainingDownloads > 0) {
                    downloadButtonHTML = `<button class="download-button" data-index="${index}">Descargar (${remainingDownloads})</button>`;
                } else {
                    downloadButtonHTML = '<button class="download-button disabled" disabled>Descargas agotadas</button>';
                }
            }

            const itemHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Precio Total: $${formattedPrice} MXN</p>
                    <p>Cantidad: ${item.quantity}</p>
                    <p>Fecha de compra: ${new Date(item.purchaseDate).toLocaleDateString()}</p>
                    ${downloadLink ? `<p>Descargas restantes: ${remainingDownloads}</p>` : ''}
                </div>
                ${downloadButtonHTML}
            `;

            purchaseItem.innerHTML = itemHTML;
            historyContainer.appendChild(purchaseItem);
        });

        // Mostrar gran total
        const totalDiv = document.createElement('div');
        totalDiv.style.marginTop = "20px";
        totalDiv.style.fontWeight = "bold";
        totalDiv.style.fontSize = "1.1em";
        totalDiv.textContent = `Total de todas las compras: $${grandTotal.toFixed(2)} MXN`;
        historyContainer.appendChild(totalDiv);

        // Evento clic para descargar
        document.querySelectorAll('.download-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const index = e.currentTarget.dataset.index;
                handleDownload(index);
            });
        });
    }

    // Función para manejar la descarga
    function handleDownload(index) {
        let purchaseHistory = getPurchaseHistory();
        const product = purchaseHistory[index];

        if (!product) {
            showNotification('Error al encontrar el producto.');
            return;
        }

        const remainingDownloads = product.quantity - product.downloads;

        if (product.downloadLink && remainingDownloads > 0) {
            product.downloads++;
            savePurchaseHistory(purchaseHistory);

            // Actualizar el link de descarga con dominio
            let downloadURL = product.downloadLink;
            if (!downloadURL.startsWith('http')) {
                downloadURL = `https://cyberxtremeprograms.store/${downloadURL.replace(/^\//, '')}`;
            }

            // Forzar descarga sin redirigir
            const a = document.createElement('a');
            a.href = downloadURL;
            a.download = '';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            showNotification(`¡Descarga iniciada para ${product.name}! Te quedan ${remainingDownloads - 1} descargas.`);
            renderPurchaseHistory();
        } else {
            showNotification('Has agotado el número de descargas para este producto.');
            const button = document.querySelector(`button[data-index="${index}"]`);
            if (button) {
                button.disabled = true;
                button.textContent = 'Descargas agotadas';
            }
        }
    }

    renderPurchaseHistory();
});
