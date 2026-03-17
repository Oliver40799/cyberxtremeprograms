document.addEventListener("DOMContentLoaded", () => {

const historyList = document.getElementById("history-list");
const clearBtn = document.getElementById("clear-history-button");

if(!historyList) return;

let history = JSON.parse(localStorage.getItem("history")) || [];

renderHistory();

function renderHistory(){

historyList.innerHTML = "";

if(history.length === 0){

historyList.innerHTML = "<p>No has visto ningún producto todavía.</p>";

if(clearBtn) clearBtn.style.display = "none";

return;

}

const historyCopy = [...history].reverse();

historyCopy.forEach(product => {

const card = document.createElement("div");

card.className = "history-card";

card.innerHTML = ` <a href="${product.url}"> <img src="${product.image}" alt="${product.name}">

<h3>${product.name}</h3>
<p>$${product.price} MXN</p>
</a>
`;

historyList.appendChild(card);

});

if(clearBtn) clearBtn.style.display = "block";

}

/* =============================== */
/* BOTÓN LIMPIAR HISTORIAL */
/* =============================== */

if(clearBtn){

clearBtn.addEventListener("click", () => {

showDeleteModal();

});

}

/* =============================== */
/* MODAL BONITO */
/* =============================== */

function showDeleteModal(){

const modal = document.createElement("div");

modal.className = "cx-modal";

modal.innerHTML = `

<div class="cx-modal-box">

<h3>⚠ Limpiar historial</h3>

<p>¿Seguro que quieres borrar todo tu historial de visualización?</p>

<div class="cx-modal-buttons">

<button class="cx-cancel">Cancelar</button>

<button class="cx-delete">Eliminar</button>

</div>

</div>

`;

document.body.appendChild(modal);

/* cancelar */

modal.querySelector(".cx-cancel").onclick = () => {

modal.remove();

};

/* eliminar */

modal.querySelector(".cx-delete").onclick = () => {

const cards = document.querySelectorAll(".history-card");

cards.forEach(card => {
card.classList.add("fade-out");
});

setTimeout(()=>{

localStorage.removeItem("history");

history = [];

renderHistory();

},500);

modal.remove();

};

}

});
