// /Descargas/descargas.js - VERSIÓN FINAL Y COMPROBADA (COMPATIBILIDAD MÁXIMA DE ESCRITURA Y LECTURA)

document.addEventListener('DOMContentLoaded', () => {
    // [Sección 0 y 1: Configuración, inicialización y obtención de productKey, NO MODIFICADA]
    const productNameElement = document.getElementById('product-name');
    const downloadButton = document.getElementById('download-button');

    // Inicializar Toast (mensajes flotantes)
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.style = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #333;
        color: #fff;
        padding: 12px 20px;
        border-radius: 8px;
        opacity: 0;
        transition: opacity 0.5s;
        z-index: 1000;
    `;
    document.body.appendChild(toast);

    function showToast(message) {
        toast.textContent = message;
        toast.style.opacity = '1';
        setTimeout(() => { toast.style.opacity = '0'; }, 3000);
    }

    // ⭐ MAPA DE ENLACES DE DESCARGA ⭐
    const downloadLinks = {
        //Plantillas Pro
        'agencia-de-marketing-digital': '/Descargas/plantillas-pro/agencia-de-marketing-digital.zip',
        'academia-de-cursos-online': '/Descargas/plantillas-pro/academia-de-cursos-online.zip',
        'agencia-de-viajes': '/Descargas/plantillas-pro/agencia-de-viajes.zip',
        'clinica-medica-con-citas': '/Descargas/plantillas-pro/clinica-medica-con-citas.zip',
        'diseno-de-interiores': '/Descargas/plantillas-pro/diseno-de-interiores.zip',
        'editorial-o-libreria-online': '/Descargas/plantillas-pro/editorial-o-libreria-online.zip',
        'floreria-con-envios': '/Descargas/plantillas-pro/floreria-con-envios.zip',
        'gimnasio-con-membresias': '/Descargas/plantillas-pro/gimnasio-con-membresias.zip',
        'plantilla-de-asesoria-financiera': '/Descargas/plantillas-pro/plantilla-de-asesoria-financiera.zip',
        'restaurante-con-reservas': '/Descargas/plantillas-pro/restaurante-con-reservas.zip',
        'salon-de-belleza-con-agenda': '/Descargas/plantillas-pro/salon-de-belleza-con-agenda.zip',
        'servicios-de-limpieza-a-domicilio': '/Descargas/plantillas-pro/servicios-de-limpieza-a-domicilio.zip',
        'sitio-de-fotografo-profesional': '/Descargas/plantillas-pro/sitio-de-fotografo-profesional.zip',
        'sitio-para-musica-y-bandas': '/Descargas/plantillas-pro/sitio-para-musica-y-bandas.zip',
        'sitio-para-podcast': '/Descargas/plantillas-pro/sitio-para-podcast.zip',
        'tienda-de-alimentos-organicos': '/Descargas/plantillas-pro/tienda-de-alimentos-organicos.zip',
        'tienda-de-electronica': '/Descargas/plantillas-pro/tienda-de-electronica.zip',
        'tienda-de-muebles': '/Descargas/plantillas-pro/tienda-de-muebles.zip',
        'tienda-de-ropa-minimalista': '/Descargas/plantillas-pro/tienda-de-ropa-minimalista.zip',
        'venta-de-productos-digitales': '/Descargas/plantillas-pro/venta-de-productos-digitales.zip',
        //Plantillas Basicas
        'cursos-tecnologia': '/Descargas/plantillas-basicas/cursos-tecnologia.zip',
        'cyberstore': '/Descargas/plantillas-basicas/cyberstore.zip',
        'fastbuylite': '/Descargas/plantillas-basicas/fastbuylite.zip',
        'landingcursos-online': '/Descargas/plantillas-basicas/landingcursos-online.zip',
        'landingempresa': '/Descargas/plantillas-basicas/landingempresa.zip',
        'landingevento': '/Descargas/plantillas-basicas/landingevento.zip',
        'landinggaming': '/Descargas/plantillas-basicas/landinggaming.zip',
        'landinggimnasio': '/Descargas/plantillas-basicas/landinggimnasio.zip',
        'landingrestaurante': '/Descargas/plantillas-basicas/landingrestaurante.zip',
        'landingrevista': '/Descargas/plantillas-basicas/landingrevista.zip',
        'landingspabelleza': '/Descargas/plantillas-basicas/landingspabelleza.zip',
        'minishop': '/Descargas/plantillas-basicas/minishop.zip',
        'minitiendagadgets': '/Descargas/plantillas-basicas/minitiendagadgets.zip',
        'pixelmarket': '/Descargas/plantillas-basicas/pixelmarket.zip',
        'portafolio-basico': '/Descargas/plantillas-basicas/portafolio-basico.zip',
        'portafolioartista': '/Descargas/plantillas-basicas/portafolioartista.zip',
        'quickcartbasic': '/Descargas/plantillas-basicas/quickcartbasic.zip',
        'simpleelectro': '/Descargas/plantillas-basicas/simpleelectro.zip',
        'techlanding': '/Descargas/plantillas-basicas/techlanding.zip',
        'landingcursoscortos': '/Descargas/plantillas-basicas/landingcursoscortos.zip',
    };
    
    // ==============================================
    // 1. OBTENER INFORMACIÓN Y VALIDAR 
    // ==============================================
    const urlParams = new URLSearchParams(window.location.search);
    let rawProductKey = urlParams.get('productId') || urlParams.get('purchaseId');

    if (!rawProductKey) {
        for (const [key, value] of urlParams.entries()) {
            if (key.startsWith('purch_')) {
                rawProductKey = key.substring(6); 
                if (rawProductKey.includes(':')) {
                    rawProductKey = rawProductKey.split(':')[0]; 
                }
                break;
            }
        }
    }

    const productKey = rawProductKey ? rawProductKey.toLowerCase() : null; 
    
    if (!productKey) {
        if (productNameElement) productNameElement.textContent = 'Error: No se encontró la información de la compra.';
        if (downloadButton) downloadButton.style.display = 'none';
        return;
    }
    
    const downloadUrl = downloadLinks[productKey];
    const productName = productKey.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    if (productNameElement) productNameElement.textContent = productName;

    if (!downloadUrl) {
        if (downloadButton) {
            downloadButton.textContent = 'Error: Archivo no encontrado. Contacte a soporte.';
            downloadButton.classList.add('disabled');
        }
        showToast(`¡Alerta! No se encontró la URL para el ID: ${productKey}.`);
        return;
    }
    
    // ==============================================
    // 2. LÓGICA DE CONTADOR Y ESTADO INICIAL
    // ==============================================

    const getPurchaseHistory = () => {
        let history = null;
        let historyKey = null;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.includes('purchaseHistory') || key.startsWith('purchases_')) {
                const currentHistory = JSON.parse(localStorage.getItem(key));
                if (currentHistory && Array.isArray(currentHistory)) {
                    const item = currentHistory.find(p => 
                        (p.productId && p.productId.toLowerCase() === productKey) || 
                        (p.id && p.id.toLowerCase() === productKey)
                    );
                    if (item) {
                        history = currentHistory;
                        historyKey = key;
                        break;
                    }
                }
            }
        }
        
        if (!history) {
             history = JSON.parse(localStorage.getItem('purchaseHistory'));
             historyKey = 'purchaseHistory';
        }
        
        return { history: history || [], historyKey };
    };
    
    const getDownloadState = () => {
        const { history } = getPurchaseHistory();
        
        let item = history.find(p => 
            (p.productId && p.productId.toLowerCase() === productKey) || 
            (p.id && p.id.toLowerCase() === productKey)
        ); 

        const maxDownloads = item ? (item.maxDownloads || item.quantity) : 1; 
        const currentDownloads = item ? (item.downloadsUsed || item.downloads || 0) : 0;
        
        return { 
            history, 
            item, 
            maxDownloads, 
            currentDownloads, 
            downloadsRemaining: maxDownloads - currentDownloads 
        };
    };
    
    const updateButtonState = (remaining) => {
        if (downloadButton) {
            if (remaining <= 0) {
                downloadButton.textContent = 'Descargas agotadas';
                downloadButton.classList.add('disabled');
                downloadButton.removeAttribute('href');
                downloadButton.removeAttribute('download');
                downloadButton.disabled = true;

                downloadButton.onclick = (e) => { 
                    e.preventDefault(); 
                    showToast("Tus descargas ya se agotaron."); 
                };
            } else {
                downloadButton.textContent = `Descargar (${remaining} restante${remaining > 1 ? 's' : ''})`;
                downloadButton.classList.remove('disabled');
                downloadButton.style.display = 'inline-block';
                downloadButton.disabled = false; 
                downloadButton.onclick = null;
            }
        }
    };

    let { downloadsRemaining } = getDownloadState();
    updateButtonState(downloadsRemaining);


    // ==============================================
    // 3. MANEJO DEL EVENTO DE DESCARGA (CORRECCIÓN MÓVIL)
    // ==============================================

    if (downloadButton) {
        downloadButton.addEventListener('click', async (e) => {
            e.preventDefault();

            let state = getDownloadState();

            if (state.downloadsRemaining <= 0) {
                showToast("Tus descargas ya se agotaron.");
                updateButtonState(0);
                return; 
            }

            // 1. ESTADO DE CARGA 
            downloadButton.disabled = true;
            downloadButton.textContent = "Verificando archivo...";

            try {
                const response = await fetch(downloadUrl, { method: 'HEAD' });

                if (response.ok) { 
                    
                    // 2. Iniciar la descarga
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = downloadUrl.split('/').pop(); 
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    showToast("Descarga iniciada. Contador actualizado.");

                    let updatedProductData = null; 
                    
                    // 3. ACTUALIZACIÓN y SINCRONIZACIÓN DE LOCALSTORAGE
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key.includes('purchaseHistory') || key.startsWith('purchases_')) {
                            let history = JSON.parse(localStorage.getItem(key));
                            
                            let itemIndex = -1;
                            if (history && Array.isArray(history)) {
                                itemIndex = history.findIndex(p => 
                                    (p.productId && p.productId.toLowerCase() === productKey) || 
                                    (p.id && p.id.toLowerCase() === productKey)
                                );
                            }
                            
                            if (itemIndex !== -1) {
                                let downloads = history[itemIndex].downloadsUsed || history[itemIndex].downloads || 0;
                                let newDownloads = downloads + 1;
                                
                                history[itemIndex].downloads = newDownloads;
                                history[itemIndex].downloadsUsed = newDownloads; 

                                updatedProductData = history[itemIndex];
                                
                                // Sobreescribimos la clave actual con el historial actualizado
                                localStorage.setItem(key, JSON.stringify(history));
                                
                                console.log(`DEBUG: Contador actualizado en la clave: ${key}`);
                            }
                        }
                    }

                    // ⭐ CORRECCIÓN AGRESIVA PARA MÓVILES: Eliminar cachés temporales si la descarga está agotada. ⭐
                    let newState = getDownloadState();
                    if (newState.downloadsRemaining <= 0) {
                         for (let i = 0; i < localStorage.length; i++) {
                             const key = localStorage.key(i);
                             // Intenta eliminar cualquier clave que pudiera ser una caché de producto o ID simple
                             if (key.includes(productKey) && !key.includes('purchases_')) {
                                 localStorage.removeItem(key);
                                 console.log(`DEBUG: Eliminando caché potencial: ${key}`);
                             }
                         }
                    }
                    
                    // 4. Actualizar UI
                    setTimeout(() => {
                        updateButtonState(newState.downloadsRemaining);
                    }, 50); 

                } else if (response.status === 404) {
                    showToast("Error 404: El archivo no se encuentra en el servidor.");
                    let newState = getDownloadState();
                    updateButtonState(newState.downloadsRemaining); 
                    
                } else {
                    showToast(`Error de Servidor (${response.status}): No se pudo acceder.`);
                    let newState = getDownloadState();
                    updateButtonState(newState.downloadsRemaining); 
                }

            } catch (error) {
                console.error("Error de red al verificar el archivo:", error);
                showToast("Error de red. Reintente. No se descontó la descarga.");
                let newState = getDownloadState();
                updateButtonState(newState.downloadsRemaining); 
            }
        });
    }
});