import { dbLicencias } from "/Administar-Licencias/firebase-licencias.js";

import {
doc,
getDoc,
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";


document.addEventListener("DOMContentLoaded",loadProduct);

let images=[];
let currentIndex=0;



async function loadProduct(){

const params=new URLSearchParams(window.location.search);

const productId=params.get("id");

if(!productId) return;

const productRef=doc(dbLicencias,"products",productId);

const productSnap=await getDoc(productRef);

if(!productSnap.exists()){
console.error("Producto no encontrado");
return;
}

const data=productSnap.data();

/* ========================= */
/* GUARDAR EN HISTORIAL */
/* ========================= */

saveToHistory(productId,data,images);

/* nombre */

document.getElementById("product-name").textContent=data.name;

document.title=data.name+" | CyberXtreme Programs";



/* precio */

document.getElementById("product-price").textContent=`$${data.price} MXN`;



/* imágenes */

images=data.images || [];

if(images.length>0){

document.getElementById("product-image").src=images[0];

}



/* descripción */

document.getElementById("product-description").textContent=data.description;



/* características */

const featuresList=document.getElementById("product-features");

featuresList.innerHTML="";

if(data.features){

data.features.forEach(feature=>{

const li=document.createElement("li");

li.textContent=feature;

featuresList.appendChild(li);

});

}



/* botón carrito */

const cartBtn=document.getElementById("addCartBtn");

cartBtn.addEventListener("click",()=>{

const product={

id:productId,
name:data.name,
price:data.price,
basePrice:data.price,
image:images[0],
downloadUrl:data.downloadUrl,
isDigital:true,
isLicensed:data.isLicensed,
maxDownloads:data.maxDownloads,
quantity:1

};


let cart=JSON.parse(localStorage.getItem("cart"))||[];

const existing=cart.findIndex(item=>item.id===product.id);

if(existing>-1){

cart[existing].quantity++;

}else{

cart.push(product);

}

localStorage.setItem("cart",JSON.stringify(cart));

showToast(product.name);

});



activateCarousel();

loadRelatedProducts(productId);

}



function activateCarousel(){

const img=document.getElementById("product-image");

const prev=document.querySelector(".carousel-btn.prev");

const next=document.querySelector(".carousel-btn.next");

if(!prev || !next || images.length<=1) return;


prev.addEventListener("click",()=>{

currentIndex=(currentIndex-1+images.length)%images.length;

img.src=images[currentIndex];

});


next.addEventListener("click",()=>{

currentIndex=(currentIndex+1)%images.length;

img.src=images[currentIndex];

});

}



/* toast */

function showToast(productName){

const toast=document.createElement("div");

toast.className="cx-toast";

toast.textContent=`✔ "${productName}" añadido al carrito`;

document.body.appendChild(toast);

setTimeout(()=>toast.classList.add("show"),10);

setTimeout(()=>{

toast.classList.remove("show");

setTimeout(()=>toast.remove(),300);

},2000);

}



/* productos relacionados */

async function loadRelatedProducts(currentId){

const container=document.getElementById("related-products");

if(!container) return;

const snapshot=await getDocs(collection(dbLicencias,"products"));

let count=0;

snapshot.forEach(docItem=>{

const id=docItem.id;

if(id===currentId || count>=4) return;

const data=docItem.data();

const card=document.createElement("div");

card.className="related-card";

card.innerHTML=`

<a href="/Plantillas/producto.html?id=${id}">

<img src="${data.images ? data.images[0] : data.image}" class="related-image">

<h4>${data.name}</h4>

<p>$${data.price} MXN</p>

</a>

`;

container.appendChild(card);

count++;

});

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