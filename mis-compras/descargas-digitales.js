document.addEventListener('DOMContentLoaded', () => {
    const downloadsContainer = document.getElementById('downloads-items-container');
    const noDownloadsMessage = document.getElementById('no-digital-downloads-message');
    const clearBtn = document.getElementById('clear-purchases-button');

    function getPurchaseHistory() {
        return JSON.parse(localStorage.getItem('purchaseHistory')) || [];
    }

    function savePurchaseHistory(history) {
        localStorage.setItem('purchaseHistory', JSON.stringify(history));
    }

    function renderPurchaseHistory() {
        const purchaseHistory = getPurchaseHistory();
        if (!downloadsContainer) return;

        downloadsContainer.innerHTML = '';
        const digitalPurchases = purchaseHistory.filter(item => item.isDigital);

        if (digitalPurchases.length === 0) {
            if (noDownloadsMessage) noDownloadsMessage.style.display = 'block';
            if (clearBtn) clearBtn.style.display = 'none';
            return;
        } else {
            if (noDownloadsMessage) noDownloadsMessage.style.display = 'none';
            if (clearBtn) clearBtn.style.display = 'block';
        }

        digitalPurchases.forEach((item, index) => {
            // Genera la URL para la página de descarga con el ID del producto
            const downloadPageUrl = `/Descargas/descargas.html?id=${item.id}`;
            
            const purchaseItem = document.createElement('div');
            purchaseItem.classList.add('purchase-item');

            let downloadButtonHTML = '';
            if (item.downloads < item.quantity) {
                // El enlace ahora apunta a la página de descarga
                downloadButtonHTML = `<a class="download-button" href="${downloadPageUrl}" data-index="${index}">Descargar (${item.quantity - item.downloads})</a>`;
            } else {
                downloadButtonHTML = '<span class="download-button disabled">Descargas agotadas</span>';
            }

            purchaseItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Precio Total: $${(item.price).toFixed(2)} MXN</p>
                    <p>Cantidad: ${item.quantity}</p>
                    <p>Fecha de compra: ${new Date(item.purchaseDate).toLocaleDateString()}</p>
                    <p>Descargas restantes: ${item.quantity - item.downloads}</p>
                </div>
                ${downloadButtonHTML}
            `;

            downloadsContainer.appendChild(purchaseItem);
        });

        // Este evento se encarga de aumentar el contador de descargas ANTES de la redirección
        downloadsContainer.querySelectorAll('.download-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const purchaseHistory = getPurchaseHistory();
                const itemToUpdate = purchaseHistory[index];
                
                if (itemToUpdate && itemToUpdate.downloads < itemToUpdate.quantity) {
                    itemToUpdate.downloads += 1;
                    savePurchaseHistory(purchaseHistory);
                    
                    // Ya no se necesita renderHistory() porque la página se recargará
                    // al ir a descarga.html
                }
            });
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm("¿Seguro quieres borrar todo tu historial de compras?")) {
                localStorage.removeItem('purchaseHistory');
                renderPurchaseHistory();
            }
        });
    }

    renderPurchaseHistory();
});