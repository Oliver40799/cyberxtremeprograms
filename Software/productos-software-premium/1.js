import { dbLicencias } from "/Administar-Licencias/firebase-licencias.js"
import { doc,getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"


async function loadPrices(){

const planes=["1_mes","3_meses","6_meses","12_meses"]

for(const plan of planes){

const ref=doc(dbLicencias,"zenith_planes",plan)
const snap=await getDoc(ref)


if(snap.exists()){

const data=snap.data()
const el=document.getElementById("price-"+plan)

if(el){
el.textContent="$"+data.precio+" MXN"
}

}

}

}

document.querySelectorAll(".buy-plan").forEach(button=>{

button.addEventListener("click",async()=>{

const planId=button.dataset.plan

const ref=doc(dbLicencias,"zenith_planes",planId)
const snap=await getDoc(ref)


if(!snap.exists()){
showToast("Error: plan no encontrado")
return
}

const data=snap.data()

const meses=data.duracion||1
const price=data.precio||0

const product={
id:`zenith_${planId}`,   // ⭐ clave
name:data.nombre,
price:price,
basePrice:price,
image:"/Imagenes/Zenith/Logo Zenith Web.png",
downloadUrl:"software/zenith/zenith.zip",
category:"software",
isDigital:false,
isLicensed:true,
maxDownloads:1,
months:Number(meses),
quantity:1
}
let cart=JSON.parse(localStorage.getItem("cart"))||[]

const existing=cart.findIndex(item=>item.id===product.id)

if(existing>-1){cart[existing].quantity++}
else{cart.push(product)}

localStorage.setItem("cart",JSON.stringify(cart))

showToast("Zenith agregado al carrito")

})

})

function showToast(text){

const toast=document.createElement("div")
toast.className="cx-toast"
toast.textContent=text

document.body.appendChild(toast)

setTimeout(()=>toast.classList.add("show"),10)

setTimeout(()=>{

toast.classList.remove("show")

setTimeout(()=>toast.remove(),300)

},2200)

}

document.addEventListener("DOMContentLoaded",loadPrices)