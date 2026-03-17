import{db,getCurrentUserId}from"../auth.js"
import{collection,query,where,onSnapshot}from"https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js"

const container=document.getElementById("refundsList")
const newBtn=document.getElementById("refundNewBtn")

const statEnviados=document.getElementById("stat-enviados")
const statRevisando=document.getElementById("stat-revisando")
const statAprobados=document.getElementById("stat-aprobados")
const statRechazados=document.getElementById("stat-rechazados")

if(!container){
console.warn("refundsList no existe")
}else{
init()
}

async function init(){

try{

const userId=await getCurrentUserId()

if(!userId){
container.innerHTML="<p>Debes iniciar sesión para ver tus reembolsos.</p>"
return
}

const q=query(collection(db,"refund_requests"),where("userId","==",userId))

onSnapshot(q,(snapshot)=>{

container.innerHTML=""

let enviados=0
let revisando=0
let aprobados=0
let rechazados=0
let activas=0

if(snapshot.empty){

if(newBtn)newBtn.style.display="none"

container.innerHTML=`
<div class="refund-empty">
<i class="fas fa-file-invoice-dollar"></i>
<h3>No tienes solicitudes de reembolso</h3>
<p>Puedes crear una solicitud si tu compra tiene algún problema.</p>
<a href="/rembolsos/reembolsos.html" class="refund-create-btn">
<i class="fas fa-plus"></i> Crear solicitud
</a>
</div>
`

updateStats(enviados,revisando,aprobados,rechazados)
return
}

snapshot.forEach(doc=>{

const data=doc.data()
const status=data.status||"enviado"

if(status==="enviado"){enviados++;activas++}
if(status==="revisando"){revisando++;activas++}
if(status==="aprobado")aprobados++
if(status==="rechazado")rechazados++

container.innerHTML+=`
<div class="refund-card">
<h3>${data.productName||"Producto"}</h3>
<p><strong>Código de compra:</strong> ${data.orderCode||"-"}</p>
<div class="refund-status status-${status}">
${status}
</div>
${data.adminMessage?`
<div class="admin-message">
${data.adminMessage}
</div>
`:""}
</div>
`

})

if(newBtn)newBtn.style.display="none"

if(activas<2){

container.innerHTML+=`
<div class="refund-create-wrapper">
<a href="/rembolsos/reembolsos.html" class="refund-create-btn">
<i class="fas fa-plus"></i> Crear nueva solicitud
</a>
</div>
`

}else{

container.innerHTML+=`
<div class="refund-limit-card">

<div class="refund-limit-icon">
<i class="fas fa-triangle-exclamation"></i>
</div>

<div class="refund-limit-content">
<h3>Límite de solicitudes alcanzado</h3>
<p>
Solo puedes tener <strong>2 solicitudes de reembolso activas</strong> al mismo tiempo.
Cuando una solicitud sea revisada o finalizada podrás crear otra nueva.
</p>
</div>

</div>
`

}

updateStats(enviados,revisando,aprobados,rechazados)

})

}catch(error){

console.error("Error cargando reembolsos",error)
container.innerHTML="<p>Error cargando solicitudes.</p>"

}

}

function updateStats(e,r,a,re){
if(statEnviados)statEnviados.textContent=e
if(statRevisando)statRevisando.textContent=r
if(statAprobados)statAprobados.textContent=a
if(statRechazados)statRechazados.textContent=re
}