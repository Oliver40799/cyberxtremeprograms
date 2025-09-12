document.addEventListener('DOMContentLoaded', () => {

    const licensesContainer = document.getElementById('licenses-list');
    const noLicensesMessage = document.getElementById('no-licenses-message');

    function getPurchaseHistory() {
        return JSON.parse(localStorage.getItem('purchaseHistory')) || [];
    }

    function savePurchaseHistory(history) {
        localStorage.setItem('purchaseHistory', JSON.stringify(history));
    }
    
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


    function renderLicenses() {
        const purchaseHistory = getPurchaseHistory();
        const licensedPurchases = purchaseHistory.filter(item => item.isLicensed);
        
        // Limpia el contenedor, pero deja el título
        licensesContainer.innerHTML = '<h3>Mis Licencias de Software</h3>';
        
        if (licensedPurchases.length === 0) {
            const message = document.createElement('p');
            message.textContent = 'No tienes licencias activas.';
            licensesContainer.appendChild(message);
        } else {
            licensedPurchases.forEach(item => {
                const isActivated = item.isActivated || false;
                const statusClass = isActivated ? 'status-active' : 'status-not-activated';
                const statusText = isActivated ? 'Activada' : 'No Activada';

                const licenseItem = document.createElement('div');
                licenseItem.classList.add('purchase-item');
                licenseItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>Precio Total: $${(item.price * item.quantity).toFixed(2)} MXN</p>
                        <p>Clave de Licencia: <span class="license-key-display">${isActivated ? item.licenseKey : '*************'}</span></p>
                        <p>Fecha de expiración: ${new Date(item.expiryDate).toLocaleDateString()}</p>
                        <p class="license-status ${statusClass}">Estado: ${statusText}</p>
                    </div>
                    ${isActivated 
                        ? `<button class="download-button" data-id="${item.id}">Descargar Producto</button>` 
                        : `<div class="activation-section">
                            <input type="text" class="activation-input" placeholder="Ingresa tu clave" data-id="${item.id}">
                            <button class="activate-button" data-id="${item.id}">Activar</button>
                           </div>`
                    }
                `;
                licensesContainer.appendChild(licenseItem);
            });
        }
    }

    // Event listeners para los botones de licencias
    document.addEventListener('click', (e) => {
        const target = e.target;
        
        if (target.classList.contains('download-button')) {
            const productId = target.dataset.id;
            const purchaseHistory = getPurchaseHistory();
            const product = purchaseHistory.find(p => p.id === productId);

            if (product && product.isLicensed && product.isActivated) {
                window.open(product.downloadUrl, '_blank');
                showNotification('Tu descarga ha comenzado.');
            } else if (product && product.isLicensed && !product.isActivated) {
                 showNotification('Por favor, activa tu licencia para descargar el producto.');
            }
        }
        
        if (target.classList.contains('activate-button')) {
            const productId = target.dataset.id;
            const purchaseHistory = getPurchaseHistory();
            const product = purchaseHistory.find(p => p.id === productId);
            const input = document.querySelector(`.activation-input[data-id="${productId}"]`);
            
            if (input && product) {
                const enteredKey = input.value.trim();
                if (enteredKey === product.licenseKey) {
                    product.isActivated = true;
                    savePurchaseHistory(purchaseHistory);
                    showNotification('¡Licencia activada con éxito!');
                    renderLicenses();
                } else {
                    showNotification('Clave de licencia incorrecta.');
                }
            }
        }
    });

    renderLicenses();
});