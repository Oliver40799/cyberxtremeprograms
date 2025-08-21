document.addEventListener('DOMContentLoaded', () => {

    const digitalDownloadsList = document.getElementById('digital-downloads-list');
    const noDownloadsMessage = document.getElementById('no-digital-downloads-message');
    const licensesList = document.getElementById('licenses-list');
    const noLicensesMessage = document.getElementById('no-licenses-message');
    const actionButtonsContainer = document.getElementById('action-buttons');
    const clearPurchasesButton = document.getElementById('clear-purchases-button');

    function renderPurchases() {
        const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
        
        if (purchaseHistory.length > 0) {
            actionButtonsContainer.style.display = 'block';
        } else {
            actionButtonsContainer.style.display = 'none';
        }

        const digitalPurchases = purchaseHistory.filter(item => !item.isLicensed);
        const licensedPurchases = purchaseHistory.filter(item => item.isLicensed);

        if (digitalPurchases.length > 0) {
            noDownloadsMessage.style.display = 'none';
            digitalDownloadsList.innerHTML = '<h3>Descargas Digitales</h3>';
            digitalPurchases.forEach(item => {
                const purchaseItem = document.createElement('div');
                purchaseItem.classList.add('purchase-item');
                purchaseItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="purchase-details">
                        <h3>${item.name}</h3>
                        <p>Fecha de compra: ${new Date(item.purchaseDate).toLocaleDateString()}</p>
                        <p>Total: $${item.price.toFixed(2)} MXN</p>
                    </div>
                `;
                digitalDownloadsList.appendChild(purchaseItem);
            });
        } else {
            noDownloadsMessage.style.display = 'block';
        }

        if (licensedPurchases.length > 0) {
            noLicensesMessage.style.display = 'none';
            licensesList.innerHTML = '<h3>Mis Licencias de Software</h3>';
            licensedPurchases.forEach(item => {
                const now = new Date();
                const expiryDate = new Date(item.expiryDate);
                const isExpired = now > expiryDate;
                const isActivated = item.isActivated || false; // ¡NUEVO! Verifica si el producto fue activado

                const statusClass = isExpired ? 'status-expired' : (isActivated ? 'status-active' : 'status-not-activated');
                const statusText = isExpired ? 'Vencida' : (isActivated ? 'Activada' : 'No Activada');

                const licenseItem = document.createElement('div');
                licenseItem.classList.add('license-item');
                licenseItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="license-details">
                        <h3>${item.name}</h3>
                        <p>Clave de Licencia: <span class="license-key-display">${item.licenseKey}</span></p>
                        <p>Fecha de expiración: ${expiryDate.toLocaleDateString()}</p>
                        <p class="license-status ${statusClass}">Estado: ${statusText}</p>
                    </div>
                    <div class="license-actions">
                        ${isExpired ? 
                            `<button class="renew-btn" data-id="${item.id}">Renovar Licencia</button>` :
                            `<button class="download-btn" data-id="${item.id}" ${!isActivated ? 'disabled' : ''}>Descargar Producto</button>`
                        }
                    </div>
                `;
                licensesList.appendChild(licenseItem);
            });
        } else {
            noLicensesMessage.style.display = 'block';
        }
    }

    licensesList.addEventListener('click', (e) => {
        if (e.target.classList.contains('download-btn')) {
            const productId = e.target.dataset.id;
            alert(`Iniciando descarga de ${productId}...`);
        }
    });

    if (clearPurchasesButton) {
        clearPurchasesButton.addEventListener('click', () => {
            const confirmClear = confirm("¿Estás seguro de que quieres eliminar todo tu historial de compras?");
            if (confirmClear) {
                localStorage.removeItem('purchaseHistory');
                renderPurchases();
            }
        });
    }

    renderPurchases();
});