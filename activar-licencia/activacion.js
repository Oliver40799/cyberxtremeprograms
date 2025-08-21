document.addEventListener('DOMContentLoaded', () => {
    const licenseInput = document.getElementById('license-input');
    const activateButton = document.getElementById('activate-button');
    const activationMessage = document.getElementById('activation-message');

    if (activateButton) {
        activateButton.addEventListener('click', () => {
            const enteredKey = licenseInput.value.trim();
            if (enteredKey === '') {
                activationMessage.textContent = 'Por favor, introduce una clave de licencia.';
                activationMessage.className = 'message-error';
                return;
            }

            const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
            // Usamos findIndex para obtener el índice del producto, lo que nos permite modificarlo
            const licensedProductIndex = purchaseHistory.findIndex(item => item.licenseKey === enteredKey);

            if (licensedProductIndex !== -1) {
                const licensedProduct = purchaseHistory[licensedProductIndex];
                const now = new Date();
                const expiryDate = new Date(licensedProduct.expiryDate);

                if (now > expiryDate) {
                    activationMessage.textContent = 'Tu licencia ha expirado. Por favor, renuévala.';
                    activationMessage.className = 'message-error';
                } else if (licensedProduct.isActivated) {
                    activationMessage.textContent = 'Esta licencia ya ha sido activada.';
                    activationMessage.className = 'message-success';
                } else {
                    // ¡NUEVO! Actualizamos la propiedad isActivated a true
                    licensedProduct.isActivated = true;
                    // Guardamos la versión actualizada del historial en localStorage
                    localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));

                    activationMessage.textContent = '¡Licencia activada con éxito! Puedes usar el producto.';
                    activationMessage.className = 'message-success';
                }
            } else {
                activationMessage.textContent = 'Clave de licencia no válida.';
                activationMessage.className = 'message-error';
            }
        });
    }
});