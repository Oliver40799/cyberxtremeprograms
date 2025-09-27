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

    function showToast(message) {
        const toast = document.createElement('div');
        toast.classList.add('toast-message');
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 2500);
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
            if (item.downloads === undefined) item.downloads = 0;
            const remainingDownloads = item.quantity - item.downloads;

            const purchaseItem = document.createElement('div');
            purchaseItem.classList.add('purchase-item');

            let downloadButtonHTML = '';
            if (remainingDownloads > 0) {
                downloadButtonHTML = `<a class="download-button" href="#" data-index="${index}">Descargar (${remainingDownloads})</a>`;
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
                    <p>Descargas restantes: ${remainingDownloads}</p>
                </div>
                ${downloadButtonHTML}
            `;
            downloadsContainer.appendChild(purchaseItem);
        });

        downloadsContainer.querySelectorAll('.download-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();

                const index = parseInt(e.target.dataset.index);
                const purchaseHistory = getPurchaseHistory();
                const itemToUpdate = purchaseHistory[index];

                if (itemToUpdate && itemToUpdate.downloads < itemToUpdate.quantity) {
                    // Redirige a la página de descarga
                    window.location.href = `/Descargas/descargas.html?id=${itemToUpdate.id}&quantity=${itemToUpdate.quantity}`;
                } else {
                    e.target.outerHTML = '<span class="download-button disabled">Descargas agotadas</span>';
                    showToast('Tus descargas ya se agotaron.');
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
