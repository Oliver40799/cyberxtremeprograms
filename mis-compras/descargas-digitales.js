document.addEventListener('DOMContentLoaded', () => {
    const downloadsContainer = document.getElementById('downloads-items-container');
    const noDownloadsMessage = document.getElementById('no-digital-downloads-message');

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
        const digitalPurchases = purchaseHistory.filter(item => item.downloadLink);

        if (digitalPurchases.length === 0) {
            noDownloadsMessage.style.display = 'block';
            return;
        } else {
            noDownloadsMessage.style.display = 'none';
        }

        digitalPurchases.forEach((item, index) => {
            if (item.downloads === undefined) item.downloads = 0;
            const remainingDownloads = item.quantity - item.downloads;

            const purchaseItem = document.createElement('div');
            purchaseItem.classList.add('purchase-item');

            let downloadButtonHTML = '';
            if (remainingDownloads > 0) {
                downloadButtonHTML = `<button class="download-button" data-index="${index}">Descargar (${remainingDownloads})</button>`;
            } else {
                downloadButtonHTML = '<span class="download-button disabled">Descargas agotadas</span>';
            }

            purchaseItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Precio Total: $${item.price.toFixed(2)} MXN</p>
                    <p>Cantidad: ${item.quantity}</p>
                    <p>Fecha de compra: ${new Date(item.purchaseDate).toLocaleDateString()}</p>
                    <p>Descargas restantes: ${remainingDownloads}</p>
                </div>
                ${downloadButtonHTML}
            `;

            downloadsContainer.appendChild(purchaseItem);
        });

        // Escuchar botones
        downloadsContainer.querySelectorAll('.download-button').forEach(button => {
            button.addEventListener('click', () => {
                const purchaseHistory = getPurchaseHistory();
                const item = purchaseHistory[button.dataset.index];

                if (!item || !item.downloadLink) {
                    alert("⚠️ Error: este producto no tiene enlace de descarga.");
                    return;
                }

                if (item.downloads < item.quantity) {
                    item.downloads += 1;
                    savePurchaseHistory(purchaseHistory);
                    window.open(item.downloadLink, '_blank'); // ✅ Abre MediaFire
                    renderPurchaseHistory();
                }
            });
        });
    }

    renderPurchaseHistory();
});
