document.addEventListener('DOMContentLoaded', () => {

    const digitalDownloadsList = document.getElementById('digital-downloads-list');
    const noDownloadsMessage = document.getElementById('no-digital-downloads-message');
    const licensesList = document.getElementById('licenses-list');
    const noLicensesMessage = document.getElementById('no-licenses-message');
    const actionButtonsContainer = document.getElementById('action-buttons');
    const clearPurchasesButton = document.getElementById('clear-purchases-button');

    // Aquí puedes mantener tus claves de licencia si las necesitas para futuros productos.
    const licenseKeys = {
        'Cyber Admin Pro': '35PHAGSB-7I8H'
    };

    function renderPurchases() {
        const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
        
        if (purchaseHistory.length > 0) {
            actionButtonsContainer.style.display = 'block';
        } else {
            actionButtonsContainer.style.display = 'none';
        }

        const digitalPurchases = purchaseHistory.filter(item => !item.isLicensed);
        const licensedPurchases = purchaseHistory.filter(item => item.isLicensed);

        // Renderizado de descargas digitales
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
                    <div class="purchase-actions">
                        <a href="${item.downloadUrl}" target="_blank" class="download-btn">Descargar Archivo</a>
                    </div>
                `;
                digitalDownloadsList.appendChild(purchaseItem);
            });
        } else {
            noDownloadsMessage.style.display = 'block';
            digitalDownloadsList.innerHTML = `<h3>Descargas Digitales</h3><p id="no-digital-downloads-message">No has realizado descargas digitales todavía.</p>`;
        }

        // Renderizado de licencias de software (SOLO SE CAMBIÓ LA LÍNEA DEL BOTÓN DE DESCARGA)
        if (licensedPurchases.length > 0) {
            noLicensesMessage.style.display = 'none';
            licensesList.innerHTML = '<h3>Mis Licencias de Software</h3>';
            licensedPurchases.forEach(item => {
                const now = new Date();
                const expiryDate = new Date(item.expiryDate);
                const isExpired = now > expiryDate;
                const isActivated = item.isActivated || false;

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
                            `<a href="${item.downloadUrl}" target="_blank" class="download-btn" ${!isActivated ? 'disabled' : ''}>Descargar Producto</a>`
                        }
                    </div>
                `;
                licensesList.appendChild(licenseItem);
            });
        } else {
            noLicensesMessage.style.display = 'block';
            licensesList.innerHTML = `<h3>Mis Licencias de Software</h3><p id="no-licenses-message">No tienes licencias activas.</p>`;
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