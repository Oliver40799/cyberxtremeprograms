// mis-compras.js - sincronización, licencias y descargas (versión corregida)
import { db, getCurrentUserId } from "../auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const MAX_LICENSE_DOWNLOADS = 1; // Límite por defecto para licencias

function showModal(type, title, message) {
    alert(`${title}\n\n${message}`);
}

async function fetchPurchases(userId) {
    if (!userId) return [];

    let purchases = [];
    let localPurchasesMap = {};

    const urlParams = new URLSearchParams(window.location.search);
    const forceFirebaseLoad = urlParams.has('refreshed');

    if (forceFirebaseLoad) {
        console.log("Activación detectada: Forzando lectura de Firebase.");
        history.replaceState({}, document.title, window.location.pathname);
    } else {
        const localData = localStorage.getItem(`purchases_${userId}`);
        if (localData) {
            const localArray = JSON.parse(localData);
            localArray.forEach(item => {
                localPurchasesMap[item.id] = {
                    downloadsUsed: item.downloadsUsed || item.downloads || 0,
                    isActivated: item.isActivated || false
                };
            });
            console.log("Contadores obtenidos de LocalStorage.");
        }
    }

    try {
        const purchasesRef = collection(db, "users", userId, "purchases");
        const snapshot = await getDocs(purchasesRef);

        purchases = snapshot.docs.map(docItem => {
            const data = docItem.data();
            const purchaseId = docItem.id;
            const localCounter = localPurchasesMap[purchaseId] || {};

            return {
                id: purchaseId,
                ...data,
                productId: data.productId || data.productID || data.product_id || null,
                productName: data.productName || data.name || data.product || 'Producto',
                image: data.image || data.productImage || null,
                downloadUrl: data.downloadUrl || data.download || data.fileUrl || null,
                price: data.price || data.precio || 0,
                quantity: data.quantity || 1,
                isDigital: data.isDigital || false,
                isLicensed: !!data.isLicensed,
                maxDownloads: data.maxDownloads || undefined,
                licenseKey: data.licenseKey || data.codigo || null,
                downloadsUsed: localCounter.downloadsUsed !== undefined ? localCounter.downloadsUsed : (data.downloadsUsed || 0),
                isActivated: localCounter.isActivated !== undefined ? localCounter.isActivated : (!!data.isActivated),
                purchaseDateLocal: data.purchaseDate ? (data.purchaseDate.toDate ? data.purchaseDate.toDate().getTime() : new Date(data.purchaseDate).getTime()) : Date.now()
            };
        });

        // guardar copia en local
        localStorage.setItem(`purchases_${userId}`, JSON.stringify(purchases));
        console.log("Compras sincronizadas con LocalStorage.");
    } catch (error) {
        console.warn("Error al leer Firebase. Usando respaldo local:", error);
        const localData = localStorage.getItem(`purchases_${userId}`);
        if (localData) purchases = JSON.parse(localData);
    }

    return purchases;
}

function renderPurchases(purchases, userId) {
    const downloadsContainer = document.getElementById('downloads-items-container');
    const licensesContainer = document.getElementById('licenses-list');

    const noDownloadsMessage = document.getElementById('no-digital-downloads-message');
    const noLicensesMessage = document.getElementById('no-licenses-message');

    if (downloadsContainer) downloadsContainer.innerHTML = '';
    if (licensesContainer) licensesContainer.innerHTML = '<h3>Mis Licencias de Software</h3>';
    if (noDownloadsMessage) noDownloadsMessage.style.display = 'none';
    if (noLicensesMessage) noLicensesMessage.style.display = 'none';

    let digitalFound = false;
    let licensesFound = false;

    const TWENTY_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 20;
    const now = Date.now();

    const filteredPurchases = purchases.filter(item => {
        const purchaseTime = item.purchaseDateLocal || 0;
        return (now - purchaseTime) < TWENTY_DAYS_IN_MS;
    });

    filteredPurchases.forEach(item => {
        const purchasedQuantity = item.quantity || 1;
        const purchasePrice = (Number(item.price || 0) * purchasedQuantity).toFixed(2);
        const purchaseDate = item.purchaseDateLocal ? new Date(item.purchaseDateLocal).toLocaleDateString() : 'N/A';
        const downloadsUsed = item.downloadsUsed || 0;

        // calcular descargas máximas por item
        let maxDownloadsItem = 0;
        if (item.isLicensed) {
            maxDownloadsItem = item.maxDownloads || MAX_LICENSE_DOWNLOADS;
        } else if (item.isDigital) {
            maxDownloadsItem = purchasedQuantity;
        } else {
            maxDownloadsItem = 0;
        }

        const downloadsRemaining = maxDownloadsItem - downloadsUsed;
        const isDownloadable = downloadsUsed < maxDownloadsItem;

        // HTML para licencias (sin clave ni activar)
        if (item.isLicensed) {
            licensesFound = true;

const licenseActionsHTML = `
<span class="download-count ${downloadsRemaining <= 1 ? 'low' : ''}">
Descargas restantes: <b>${downloadsRemaining}</b> de <b>${maxDownloadsItem}</b>
</span>

<button class="download-button ${isDownloadable ? '' : 'disabled'}"
        data-download-url="${item.downloadUrl || ''}"
        data-purchase-id="${item.id}"
        data-product-id="${item.productId || ''}"
        data-is-licensed="true"
        ${isDownloadable ? '' : 'disabled'}>
        ${isDownloadable ? `<i class="fas fa-download"></i> Descargar` : 'Descargas agotadas'}
</button>

<a href="/Administar-Licencias/panel-admin-licencias.html" class="license-panel-btn">
<i class="fas fa-key"></i> Ir al panel de licencias
</a>
`;

            const html = `
                <div class="purchase-item license-item">
                    <img src="${item.image || '/default/software.png'}" alt="${item.productName}">
                    <div class="item-details">
                        <h3>${item.productName}</h3>
                        <p><strong>Código de compra:</strong> ${item.orderCode || "N/A"}</p>
                        <p>Precio Total: $${purchasePrice} MXN | Cantidad: <b>${purchasedQuantity}</b></p>
                        <p>Fecha de compra: ${purchaseDate}</p>
                    </div>
                    <div class="item-actions">
                        ${licenseActionsHTML}
                    </div>
                </div>
            `;
            licensesContainer.innerHTML += html;
        }
        // HTML para descargas digitales normales
        else if (item.isDigital) {
            digitalFound = true;

            const downloadActionsHTML = `
                <span class="download-count ${downloadsRemaining <= 1 ? 'low' : ''}">
                    Descargas restantes: <b>${downloadsRemaining}</b> de <b>${maxDownloadsItem}</b>
                </span>
                <button class="download-button ${isDownloadable ? '' : 'disabled'}"
                        data-download-url="${item.downloadUrl || ''}"
                        data-purchase-id="${item.id}"
                        data-product-id="${item.productId || ''}"
                        data-is-licensed="false"
                        ${isDownloadable ? '' : 'disabled'}>
                    ${isDownloadable ? `<i class="fas fa-download"></i> Descargar` : 'Descargas agotadas'}
                </button>
            `;

            const html = `
                <div class="purchase-item download-item">
                    <img src="${item.image || '/default/digital.png'}" alt="${item.productName}">
                    <div class="item-details">
                        <h3>${item.productName}</h3>
                        <p><strong>Código de compra:</strong> ${item.orderCode || "N/A"}</p>
                        <p>Precio Total: $${purchasePrice} MXN | Cantidad: <b>${purchasedQuantity}</b></p>
                        <p>Fecha de compra: ${purchaseDate}</p>
                    </div>
                    <div class="item-actions">
                        ${downloadActionsHTML}
                    </div>
                </div>
            `;
            if (downloadsContainer) downloadsContainer.innerHTML += html;
        }
    });

    if (!digitalFound && noDownloadsMessage) noDownloadsMessage.style.display = 'block';
    if (!licensesFound && noLicensesMessage) noLicensesMessage.style.display = 'block';

    // listeners
    document.querySelectorAll('.download-button:not(.disabled)').forEach(button => {
        button.addEventListener('click', (event) => handleDownload(event, userId));
    });
}

async function handleDownload(event, userId) {
    const button = event.currentTarget;
    const downloadUrl = button.getAttribute('data-download-url');
    const purchaseId = button.getAttribute('data-purchase-id');
    let productId = button.getAttribute('data-product-id');

    if (!productId && downloadUrl) {
        productId = downloadUrl.split('/').pop().replace(/\.zip$|\.rar$/i, '');
    }

    if (!downloadUrl || !purchaseId || !productId) {
        showModal('error', 'Error de Datos', 'Faltan datos de compra o producto para la descarga.');
        return;
    }

    // redirigir a la página de descargas (manteniendo los parámetros)
    window.location.href = `/Descargas/descargas.html?purchaseId=${encodeURIComponent(purchaseId)}&productId=${encodeURIComponent(productId)}`;
}

async function loadAndRenderPurchases() {
    const userId = await getCurrentUserId();

    if (!userId) {
        const mainContainer = document.querySelector('.purchases-container');
        if (mainContainer) {
            mainContainer.innerHTML = '<h2>Mis Compras</h2><p>Por favor, <a href="/INICIOS-REGISTROS/Iniciar-sesion.html">inicia sesión</a> para ver tus compras.</p>';
        }
        return;
    }

    const purchases = await fetchPurchases(userId);
    renderPurchases(purchases, userId);
}

document.addEventListener('DOMContentLoaded', loadAndRenderPurchases);
