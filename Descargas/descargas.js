// /Descargas/descargas.js

import { storage, db, getCurrentUserId } from "/auth.js";

import {
ref,
getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

import {
doc,
updateDoc,
increment
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {

const productNameElement = document.getElementById('product-name');
const downloadButton = document.getElementById('download-button');

/* toast */

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

function showToast(message){

toast.textContent = message;
toast.style.opacity = '1';

setTimeout(()=>{
toast.style.opacity='0';
},3000);

}


/* ============================= */
/* MAPA DE ARCHIVOS STORAGE */
/* ============================= */

const downloadLinks = {

/* SOFTWARE */

'zenith': 'software/zenith/zenith.zip',

/* PRO */

'agencia-de-marketing-digital': 'plantillas-pro/agencia-de-marketing-digital.zip',
'academia-de-cursos-online': 'plantillas-pro/academia-de-cursos-online.zip',
'agencia-de-viajes': 'plantillas-pro/agencia-de-viajes.zip',
'clinica-medica-con-citas': 'plantillas-pro/clinica-medica-con-citas.zip',
'diseno-de-interiores': 'plantillas-pro/diseno-de-interiores.zip',
'editorial-o-libreria-online': 'plantillas-pro/editorial-o-libreria-online.zip',
'floreria-con-envios': 'plantillas-pro/floreria-con-envios.zip',
'gimnasio-con-membresias': 'plantillas-pro/gimnasio-con-membresias.zip',
'plantilla-de-asesoria-financiera': 'plantillas-pro/plantilla-de-asesoria-financiera.zip',
'restaurante-con-reservas': 'plantillas-pro/restaurante-con-reservas.zip',
'salon-de-belleza-con-agenda': 'plantillas-pro/salon-de-belleza-con-agenda.zip',
'servicios-de-limpieza-a-domicilio': 'plantillas-pro/servicios-de-limpieza-a-domicilio.zip',
'sitio-de-fotografo-profesional': 'plantillas-pro/sitio-de-fotografo-profesional.zip',
'sitio-para-musica-y-bandas': 'plantillas-pro/sitio-para-musica-y-bandas.zip',
'sitio-para-podcast': 'plantillas-pro/sitio-para-podcast.zip',
'tienda-de-alimentos-organicos': 'plantillas-pro/tienda-de-alimentos-organicos.zip',
'tienda-de-electronica': 'plantillas-pro/tienda-de-electronica.zip',
'tienda-de-muebles': 'plantillas-pro/tienda-de-muebles.zip',
'tienda-de-ropa-minimalista': 'plantillas-pro/tienda-de-ropa-minimalista.zip',
'venta-de-productos-digitales': 'plantillas-pro/venta-de-productos-digitales.zip',

/* BASICAS */

'cursos-tecnologia': 'plantillas-basicas/cursos-tecnologia.zip',
'cyberstore': 'plantillas-basicas/cyberstore.zip',
'fastbuylite': 'plantillas-basicas/fastbuylite.zip',
'landingcursos-online': 'plantillas-basicas/landingcursos-online.zip',
'landingempresa': 'plantillas-basicas/landingempresa.zip',
'landingevento': 'plantillas-basicas/landingevento.zip',
'landinggaming': 'plantillas-basicas/landinggaming.zip',
'landinggimnasio': 'plantillas-basicas/landinggimnasio.zip',
'landingrestaurante': 'plantillas-basicas/landingrestaurante.zip',
'landingrevista': 'plantillas-basicas/landingrevista.zip',
'landingspabelleza': 'plantillas-basicas/landingspabelleza.zip',
'minishop': 'plantillas-basicas/minishop.zip',
'minitiendagadgets': 'plantillas-basicas/minitiendagadgets.zip',
'pixelmarket': 'plantillas-basicas/pixelmarket.zip',
'portafolio-basico': 'plantillas-basicas/portafolio-basico.zip',
'portafolioartista': 'plantillas-basicas/portafolioartista.zip',
'quickcartbasic': 'plantillas-basicas/quickcartbasic.zip',
'simpleelectro': 'plantillas-basicas/simpleelectro.zip',
'techlanding': 'plantillas-basicas/techlanding.zip',
'landingcursoscortos': 'plantillas-basicas/landingcursoscortos.zip'

};


/* ============================= */
/* obtener producto */
/* ============================= */

const urlParams = new URLSearchParams(window.location.search);

const purchaseId = urlParams.get("purchaseId");
let rawProductKey = urlParams.get("productId");

let productKey = rawProductKey ? rawProductKey.toLowerCase() : null;

if(productKey && productKey.startsWith("zenith")){
    productKey = "zenith";
}

if(!productKey){
productNameElement.textContent = "Error: no se encontró el producto";
return;
}

const storagePath = downloadLinks[productKey];

if(!storagePath){
downloadButton.textContent="Archivo no encontrado";
return;
}

const productName =
productKey
.replace(/-/g,' ')
.replace(/\b\w/g,c=>c.toUpperCase());

productNameElement.textContent = productName;


/* ============================= */
/* historial de compras */
/* ============================= */

const getPurchaseHistory = () => {

let history = null;

for (let i = 0; i < localStorage.length; i++) {

const key = localStorage.key(i);

if (key.includes('purchaseHistory') || key.startsWith('purchases_')) {

const currentHistory = JSON.parse(localStorage.getItem(key));

if (currentHistory && Array.isArray(currentHistory)) {
history = currentHistory;
break;
}

}

}

if (!history) {
history = JSON.parse(localStorage.getItem('purchaseHistory'));
}

return { history: history || [] };

};


/* ============================= */
/* estado de descargas */
/* ============================= */

const getDownloadState = () => {

const { history } = getPurchaseHistory();

let item = history.find(p =>
p.id && purchaseId && p.id.toLowerCase() === purchaseId.toLowerCase()
);

const maxDownloads = item ? (item.maxDownloads || 1) : 1;

const currentDownloads = item ? (item.downloadsUsed || item.downloads || 0) : 0;

return {
history,
item,
maxDownloads,
currentDownloads,
downloadsRemaining: maxDownloads - currentDownloads
};

};


/* ============================= */
/* actualizar botón */
/* ============================= */

const updateButtonState = (remaining) => {

if (!downloadButton) return;

if (remaining <= 0) {

downloadButton.textContent = "Descargas agotadas";
downloadButton.disabled = true;

} else {

downloadButton.textContent =
`Descargar (${remaining} restante${remaining > 1 ? "s" : ""})`;

downloadButton.disabled = false;

}

};

const initialState = getDownloadState();
updateButtonState(initialState.downloadsRemaining);


/* ============================= */
/* DESCARGA */
/* ============================= */

downloadButton.addEventListener("click", async (e) => {

e.preventDefault();

let state = getDownloadState();

if(state.downloadsRemaining <= 0){

showToast("Tus descargas ya se agotaron.");
updateButtonState(0);
return;

}

downloadButton.disabled = true;
downloadButton.textContent = "Preparando descarga...";

try{

const fileRef = ref(storage, storagePath);

const url = await getDownloadURL(fileRef);

/* iniciar descarga */

const link = document.createElement("a");

link.href = url;
link.download = storagePath.split('/').pop();

document.body.appendChild(link);
link.click();
document.body.removeChild(link);

showToast("Descarga iniciada. Contador actualizado.");


/* ============================= */
/* actualizar contador */
/* ============================= */

for (let i = 0; i < localStorage.length; i++) {

const key = localStorage.key(i);

if (key.includes('purchaseHistory') || key.startsWith('purchases_')) {

let history = JSON.parse(localStorage.getItem(key));

if (!Array.isArray(history)) continue;

let itemIndex = history.findIndex(p =>
p.id && purchaseId && p.id.toLowerCase() === purchaseId.toLowerCase()
);

if (itemIndex !== -1) {

let downloads = history[itemIndex].downloadsUsed || history[itemIndex].downloads || 0;

let maxDownloads = history[itemIndex].maxDownloads || 1;

let newDownloads = Math.min(downloads + 1, maxDownloads);

history[itemIndex].downloads = newDownloads;
history[itemIndex].downloadsUsed = newDownloads;

localStorage.setItem(key, JSON.stringify(history));

/* 🔥 ACTUALIZAR FIREBASE */

try{

const userId = await getCurrentUserId()

if(userId && purchaseId){

await updateDoc(
doc(db,"users",userId,"purchases",purchaseId),
{
downloadsUsed:newDownloads
}
)

}

}catch(err){
console.warn("No se pudo actualizar downloadsUsed en Firebase",err)
}

}

}

}

/* actualizar botón */

let newState = getDownloadState();

setTimeout(()=>{
updateButtonState(newState.downloadsRemaining);
},50);

}catch(error){

console.error(error);

showToast("Error obteniendo el archivo");

downloadButton.disabled=false;
downloadButton.textContent="Descargar";

}

});

});