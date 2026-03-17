import { dbLicencias } from "/Administar-Licencias/firebase-licencias.js";

import {
collection,
getDocs,
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", loadHomeProducts);

async function loadHomeProducts(){

const container = document.getElementById("home-products");

const querySnapshot = await getDocs(collection(dbLicencias,"products_basic"));

let products = [];

querySnapshot.forEach((docItem)=>{

const data = docItem.data();

products.push({
id:docItem.id,
...data
});

});


/* 🔀 MEZCLAR PRODUCTOS (RANDOM) */

products.sort(()=>Math.random() - 0.5);


/* Mostrar solo 3 */

const selected = products.slice(0,3);


selected.forEach(product=>{

const card = document.createElement("div");

card.className="product-card";

card.innerHTML=`

<a href="/Plantillas Basicas/producto.html?id=${product.id}" class="product-link">
<img src="${product.image}" class="product-image">
<h3 class="product-name">${product.name}</h3>
</a>

<p class="product-price">$${product.price} MXN</p>

<button class="add-to-cart-btn" data-id="${product.id}">
Añadir al carrito
</button>

`;

container.appendChild(card);

});


activateCartButtons();

}


/* CARRITO */

function activateCartButtons(){

const buttons=document.querySelectorAll(".add-to-cart-btn");

buttons.forEach(button=>{

button.addEventListener("click",async()=>{

const id=button.dataset.id;

const productRef=doc(dbLicencias,"products_basic",id);

const snap=await getDoc(productRef);

const data=snap.data();

const product={
id:id,
name:data.name,
price:data.price,
basePrice:data.price,
image:data.image,
downloadUrl:data.downloadUrl,
isDigital:true,
isLicensed:false,
maxDownloads:1,
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

});

}


function showToast(name){

const toast=document.createElement("div");

toast.className="cx-toast";

toast.textContent=`"${name}" añadido al carrito`;

document.body.appendChild(toast);

setTimeout(()=>toast.classList.add("show"),10);

setTimeout(()=>{

toast.classList.remove("show");

setTimeout(()=>toast.remove(),300);

},2000);

}