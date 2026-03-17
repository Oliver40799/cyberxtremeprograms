import{db,getCurrentUserId}from"../auth.js"
import{collection,addDoc,serverTimestamp,getDocs,query}from"https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"

const form=document.getElementById("refundForm")
const search=document.getElementById("productSearch")
const results=document.getElementById("purchaseResults")

const REFUND_DAYS=7
const REFUND_TIME=1000*60*60*24*REFUND_DAYS

let purchases=[]

initPurchases()

async function initPurchases(){

const userId=await getCurrentUserId()
if(!userId)return

try{

const q=query(collection(db,"users",userId,"purchases"))
const snap=await getDocs(q)

snap.forEach(doc=>{
purchases.push(doc.data())
})

}catch(e){
console.error("Error cargando compras",e)
}

}

if(search){

search.addEventListener("input",()=>{

const value=search.value.toLowerCase().trim()
results.innerHTML=""

if(!value)return

const now=Date.now()

const filtered=purchases.filter(p=>{

const name=(p.productName||"").toLowerCase()
if(!name.includes(value))return false

if(!p.purchaseDate)return false

const purchaseTime=p.purchaseDate.toDate?
p.purchaseDate.toDate().getTime():
new Date(p.purchaseDate).getTime()

// limitar a 7 días
if((now-purchaseTime)>REFUND_TIME)return false

// ❌ bloquear si ya descargó
if((p.downloadsUsed||0)>0)return false

return true

})

if(filtered.length===0){

results.innerHTML=`
<div class="refund-unavailable">

<i class="fas fa-shield-exclamation refund-icon"></i>

<h3>No hay compras elegibles para reembolso</h3>

<p class="refund-text">
Los reembolsos solo están disponibles si el producto cumple estas condiciones:
</p>

<ul class="refund-rules">
<li>El producto <b>no ha sido descargado</b></li>
<li>La compra tiene <b>menos de 7 días</b></li>
</ul>

<a href="/Terminos/terminos.html" class="refund-policy-btn">
<i class="fas fa-file-contract"></i>
Ver política de reembolsos
</a>

</div>
`
return

}

filtered.forEach(p=>{

const item=document.createElement("div")
item.className="purchase-result"

item.innerHTML=`
<img src="${p.image||"/Imagenes/default.png"}">
<div>
<strong>${p.productName}</strong>
<span>${p.orderCode||""}</span>
</div>
`

item.onclick=()=>{

document.getElementById("productName").value=p.productName||""
document.getElementById("orderNumber").value=p.orderCode||""

if(p.purchaseDate){
const d=p.purchaseDate.toDate?p.purchaseDate.toDate():new Date(p.purchaseDate)
document.getElementById("purchaseDate").value=d.toISOString().split("T")[0]
}

results.innerHTML=""
search.value=p.productName||""

}

results.appendChild(item)

})

})

}

if(form){

form.addEventListener("submit",async(e)=>{

e.preventDefault()

const btn=form.querySelector("button")
if(btn)btn.disabled=true

try{

const userId=await getCurrentUserId()

if(!userId){
showRefundMessage("error","Debes iniciar sesión para solicitar un reembolso")
if(btn)btn.disabled=false
return
}

const fullName=document.getElementById("fullName").value.trim()
const email=document.getElementById("email").value.trim()
const orderCode=document.getElementById("orderNumber").value.trim()
const purchaseDate=document.getElementById("purchaseDate").value
const productName=document.getElementById("productName").value.trim()
const reason=document.getElementById("refundReason").value.trim()

if(!fullName||!email||!orderCode||!productName||!reason){
showRefundMessage("error","Completa todos los campos")
if(btn)btn.disabled=false
return
}

const refundData={
userId:userId,
fullName:fullName,
email:email,
orderCode:orderCode,
purchaseDate:purchaseDate,
productName:productName,
reason:reason,
status:"enviado",
adminMessage:"",
createdAt:serverTimestamp(),
updatedAt:serverTimestamp()
}

await addDoc(collection(db,"refund_requests"),refundData)

showRefundMessage("success","Solicitud enviada correctamente")

form.reset()

setTimeout(()=>{
window.location.href="/rembolsos/mis-reembolsos.html"
},1800)

}catch(error){

console.error("Error enviando reembolso",error)
showRefundMessage("error","Error al enviar solicitud")

}

if(btn)btn.disabled=false

})

}

function showRefundMessage(type,message){

let box=document.createElement("div")
box.className="refund-popup "+type

box.innerHTML=`
<div class="refund-popup-content">
<i class="fas ${type==="success"?"fa-circle-check":"fa-circle-xmark"}"></i>
<span>${message}</span>
</div>
`

document.body.appendChild(box)

setTimeout(()=>{box.classList.add("show")},10)

setTimeout(()=>{
box.classList.remove("show")
setTimeout(()=>box.remove(),300)
},2000)

}