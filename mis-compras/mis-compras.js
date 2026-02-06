// mis-compras.js - CÓDIGO FINAL CORREGIDO PARA SINCRONIZACIÓN, LICENCIAS Y DESCARGAS

import { db, getCurrentUserId } from "../auth.js"; 
import { collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"; 

const MAX_LICENSE_DOWNLOADS = 3; // Límite por defecto para licencias

/**
 * Muestra el modal de notificación (usando alert como fallback).
 */
function showModal(type, title, message) {
    alert(`${title}\n\n${message}`);
}

/**
 * Obtiene el historial de compras desde Firebase (fuente primaria)
 * y lo combina con la caché de LocalStorage.
 */
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
        
        purchases = snapshot.docs.map(doc => {
            const data = doc.data();
            const purchaseId = doc.id;
            const localCounter = localPurchasesMap[purchaseId] || {};

            return {
                id: purchaseId,
                ...data,
                isDigital: data.isDigital || false,
                isLicensed: !!data.isLicensed, 
                downloadsUsed: localCounter.downloadsUsed !== undefined ? localCounter.downloadsUsed : (data.downloadsUsed || 0),
                isActivated: localCounter.isActivated !== undefined ? localCounter.isActivated : (!!data.isActivated), 
                purchaseDateLocal: data.purchaseDate ? data.purchaseDate.toDate().getTime() : Date.now() 
            };
        });
        
        localStorage.setItem(`purchases_${userId}`, JSON.stringify(purchases));
        console.log("Compras sincronizadas con LocalStorage.");
        
    } catch (error) {
        console.warn("Error al leer Firebase. Usando respaldo local:", error);
        const localData = localStorage.getItem(`purchases_${userId}`);
        if (localData) purchases = JSON.parse(localData);
    }

    return purchases;
}

/**
 * Renderiza los ítems de compra en las listas de descarga y licencia, 
 * mostrando solo los de menos de 20 días.
 */
function renderPurchases(purchases, userId) {
    const downloadsContainer = document.getElementById('downloads-items-container');
    const licensesContainer = document.getElementById('licenses-list');
    
    const noDownloadsMessage = document.getElementById('no-digital-downloads-message');
    const noLicensesMessage = document.getElementById('no-licenses-message');

    downloadsContainer.innerHTML = '';
    licensesContainer.innerHTML = '<h3>Mis Licencias de Software</h3>'; 
    if (noDownloadsMessage) noDownloadsMessage.style.display = 'none';
    if (noLicensesMessage) noLicensesMessage.style.display = 'none';

    let digitalFound = false;
    let licensesFound = false;

    const TWENTY_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 20;
    const now = Date.now();
    
    const filteredPurchases = purchases.filter(item => {
        const purchaseTime = item.purchaseDateLocal || 
            (item.purchaseDate && item.purchaseDate.toDate ? item.purchaseDate.toDate().getTime() : 0);
        return (now - purchaseTime) < TWENTY_DAYS_IN_MS;
    });

    filteredPurchases.forEach(item => {
        const purchasedQuantity = item.quantity || 1; 
        const purchasePrice = (item.price * purchasedQuantity).toFixed(2);
        const purchaseDate = item.purchaseDateLocal ? new Date(item.purchaseDateLocal).toLocaleDateString() : 'N/A';
        const downloadsUsed = item.downloadsUsed || 0;
        const isActivated = item.isActivated || false; 
        
        let maxDownloadsItem, isDownloadable, downloadsRemaining;

        if (item.isLicensed) {
            maxDownloadsItem = item.maxDownloads || MAX_LICENSE_DOWNLOADS;
        } else if (item.isDigital) {
            maxDownloadsItem = purchasedQuantity;
        } else {
            maxDownloadsItem = 0; 
        }
        
        downloadsRemaining = maxDownloadsItem - downloadsUsed;
        isDownloadable = downloadsUsed < maxDownloadsItem;
        
        let html = '';

        // 1️⃣ Licencias de software
        if (item.isLicensed) {
            licensesFound = true;
            let licenseActionsHTML = '';
            
            if (isActivated) {
                licenseActionsHTML = `
                    <p class="license-status activated">✅ Licencia Activada</p>
                    <span class="download-count ${downloadsRemaining <= 1 ? 'low' : ''}">
                        Descargas restantes: <b>${downloadsRemaining}</b> de <b>${maxDownloadsItem}</b>
                    </span>
                    <button class="download-button ${isDownloadable ? '' : 'disabled'}" 
                            data-download-url="${item.downloadUrl}"
                            data-purchase-id="${item.id}"
                            data-product-id="${item.productId}"
                            data-is-licensed="true"
                            ${isDownloadable ? '' : 'disabled'}>
                        ${isDownloadable ? `<i class="fas fa-download"></i> Descargar` : 'Descargas agotadas'}
                    </button>
                `;
            } else {
                licenseActionsHTML = `
                    <p class="license-status not-activated">❌ Licencia NO Activada</p>
                    <button class="activate-redirect-button" 
                            data-purchase-id="${item.id}">
                        Activar Licencia Aquí
                    </button>
                `;
            }
            
            html = `
                <div class="purchase-item license-item">
                    <img src="${item.image || '/default/software.png'}" alt="${item.productName}">
                    <div class="item-details">
                        <h3>${item.productName}</h3>
                        <p><strong>Código de compra:</strong> CXP-${item.id.substring(0, 10).toUpperCase()}</p>
                        <p><strong>Clave de Licencia:</strong> <code>${item.licenseKey || 'N/A'}</code></p>
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
        // 2️⃣ Descargas digitales
        else if (item.isDigital) {
            digitalFound = true;
            const downloadActionsHTML = `
                <span class="download-count ${downloadsRemaining <= 1 ? 'low' : ''}">
                    Descargas restantes: <b>${downloadsRemaining}</b> de <b>${maxDownloadsItem}</b>
                </span>
                <button class="download-button ${isDownloadable ? '' : 'disabled'}" 
                        data-download-url="${item.downloadUrl}"
                        data-purchase-id="${item.id}"
                        data-product-id="${item.productId}"
                        data-is-licensed="false"
                        ${isDownloadable ? '' : 'disabled'}>
                    ${isDownloadable ? `<i class="fas fa-download"></i> Descargar` : 'Descargas agotadas'}
                </button>
            `;
            
            html = `
                <div class="purchase-item download-item">
                    <img src="${item.image || '/default/digital.png'}" alt="${item.productName}">
                    <div class="item-details">
                        <h3>${item.productName}</h3>
                        <p><strong>Código de compra:</strong> CXP-${item.id.substring(0, 10).toUpperCase()}</p>
                        <p>Precio Total: $${purchasePrice} MXN | Cantidad: <b>${purchasedQuantity}</b></p> 
                        <p>Fecha de compra: ${purchaseDate}</p>
                    </div>
                    <div class="item-actions">
                        ${downloadActionsHTML}
                    </div>
                </div>
            `;
            
            downloadsContainer.innerHTML += html;
        }
    });

    if (!digitalFound && noDownloadsMessage) noDownloadsMessage.style.display = 'block';
    if (!licensesFound && noLicensesMessage) noLicensesMessage.style.display = 'block';

    document.querySelectorAll('.download-button:not(.disabled)').forEach(button => {
        button.addEventListener('click', (event) => handleDownload(event, userId));
    });

    document.querySelectorAll('.activate-redirect-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const purchaseId = event.currentTarget.getAttribute('data-purchase-id');
            window.location.href = `/activar-licencia/activar-licencia.html?purchaseId=${purchaseId}`;
        });
    });
}

/**
 * Maneja la descarga y redirige a la página correspondiente.
 */
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

    window.location.href = `/Descargas/descargas.html?purchaseId=${purchaseId}&productId=${productId}`;
}

/**
 * Función principal de carga.
 */
async function loadAndRenderPurchases() {
    const userId = await getCurrentUserId();

    if (!userId) {
        const mainContainer = document.querySelector('.purchases-container');
        if(mainContainer) {
            mainContainer.innerHTML = '<h2>Mis Compras</h2><p>Por favor, <a href="/INICIOS-REGISTROS/Iniciar-sesion.html">inicia sesión</a> para ver tus compras.</p>';
        }
        return;
    }

    const purchases = await fetchPurchases(userId);
    renderPurchases(purchases, userId);
}

// Ejecutar al cargar el DOM
document.addEventListener('DOMContentLoaded', loadAndRenderPurchases);
