import { dbLicencias } from "/Administar-Licencias/firebase-licencias.js";

import {
doc,
getDoc,
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";


document.addEventListener("DOMContentLoaded", loadProduct);

let images = [];
let currentIndex = 0;


async function loadProduct(){

const params = new URLSearchParams(window.location.search);

const productId = params.get("id");

if(!productId) return;


const productRef = doc(dbLicencias,"products_basic",productId);

const productSnap = await getDoc(productRef);

if(!productSnap.exists()){
console.error("Producto no encontrado");
return;
}

const data = productSnap.data();



/* ========================= */
/* NOMBRE */
/* ========================= */

document.getElementById("product-name").textContent = data.name;

document.title = data.name + " | CyberXtreme Programs";


/* ========================= */
/* PRECIO */
/* ========================= */

document.getElementById("product-price").textContent = `$${data.price} MXN`;


/* ========================= */
/* IMÁGENES */
/* ========================= */

images = data.images || [];

if(images.length > 0){
document.getElementById("product-image").src = images[0];
}

/* ========================= */
/* GUARDAR EN HISTORIAL */
/* ========================= */

saveToHistory(productId, data, images);

/* ========================= */
/* DESCRIPCIÓN */
/* ========================= */

document.getElementById("product-description").textContent = data.description;


/* ========================= */
/* CARACTERÍSTICAS */
/* ========================= */

const featuresList = document.getElementById("product-features");

featuresList.innerHTML = "";

if(data.features){

data.features.forEach(feature => {

const li = document.createElement("li");

li.textContent = feature;

featuresList.appendChild(li);

});

}


/* ========================= */
/* BOTÓN CARRITO */
/* ========================= */

const cartBtn = document.getElementById("addCartBtn");

cartBtn.dataset.id = productId;
cartBtn.dataset.name = data.name;
cartBtn.dataset.price = data.price;
cartBtn.dataset.image = images[0];
cartBtn.dataset.download = data.downloadUrl;

activateCartButton();


/* ========================= */
/* CARRUSEL */
/* ========================= */

activateCarousel();


/* ========================= */
/* PRODUCTOS RELACIONADOS */
/* ========================= */

loadRelatedProducts(productId);

}



/* ================================= */
/* CARRUSEL */
/* ================================= */

function activateCarousel(){

const img = document.getElementById("product-image");

const prev = document.querySelector(".carousel-btn.prev");

const next = document.querySelector(".carousel-btn.next");

if(!prev || !next || images.length <= 1) return;


prev.addEventListener("click",()=>{

currentIndex = (currentIndex - 1 + images.length) % images.length;

img.src = images[currentIndex];

});


next.addEventListener("click",()=>{

currentIndex = (currentIndex + 1) % images.length;

img.src = images[currentIndex];

});

}



/* ================================= */
/* CARRITO */
/* ================================= */

function activateCartButton(){

const button = document.getElementById("addCartBtn");

button.addEventListener("click",()=>{

const product = {

id:button.dataset.id,
name:button.dataset.name,
price:parseFloat(button.dataset.price),
basePrice:parseFloat(button.dataset.price),
image:button.dataset.image,
downloadUrl:button.dataset.download,
isDigital:true,
isLicensed:false,
maxDownloads:1,
quantity:1

};

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const existing = cart.findIndex(item => item.id === product.id);

if(existing > -1){

cart[existing].quantity++;

}else{

cart.push(product);

}

localStorage.setItem("cart",JSON.stringify(cart));

showToast(product.name);

});

}



/* ================================= */
/* PRODUCTOS RELACIONADOS */
/* ================================= */

async function loadRelatedProducts(currentId){

const container = document.getElementById("related-products");

const querySnapshot = await getDocs(collection(dbLicencias,"products_basic"));

let count = 0;

querySnapshot.forEach((docItem)=>{

if(docItem.id === currentId || count >= 4) return;

const product = docItem.data();
const id = docItem.id;

const card = document.createElement("div");

card.className = "related-card";

card.innerHTML = `

<a href="/Plantillas Basicas/producto.html?id=${id}">
<img src="${product.image}">
<h4>${product.name}</h4>
<p>$${product.price} MXN</p>
</a>

`;

container.appendChild(card);

count++;

});

}



/* ================================= */
/* TOAST */
/* ================================= */

function showToast(name){

const toast = document.createElement("div");

toast.className = "cx-toast";

toast.textContent = `"${name}" añadido al carrito`;

document.body.appendChild(toast);

setTimeout(()=>{
toast.classList.add("show");
},10);

setTimeout(()=>{

toast.classList.remove("show");

setTimeout(()=>{
toast.remove();
},300);

},2000);

}

/* ================================= */
/* HISTORIAL */
/* ================================= */

function saveToHistory(id, data, images){

let history = JSON.parse(localStorage.getItem("history")) || [];

const product = {

id: id,
name: data.name,
price: data.price,
image: images[0] || data.image || "",
url: window.location.href

};

/* evitar duplicados */

history = history.filter(item => item.id !== id);

history.push(product);

/* limitar historial */

if(history.length > 20){
history.shift();
}

localStorage.setItem("history", JSON.stringify(history));

}