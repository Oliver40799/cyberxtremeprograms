// ==============================================
// 🔐 PANEL DE ADMINISTRACIÓN DE LICENCIAS - CYBERXTREME PROGRAMS
// ==============================================

import { dbLicencias } from "./firebase-licencias.js";

import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// === SELECTORES ===
const licenciasContainer = document.querySelector(".panel-box:nth-of-type(1)");
const promocionesContainer = document.querySelector(".panel-box:nth-of-type(2)");

// === FUNCIÓN PRINCIPAL: CARGAR LICENCIAS ===
async function cargarLicencias(userId) {


  licenciasContainer.innerHTML = `
    <h2><i class="fas fa-id-card"></i> Licencias activas</h2>
    <div class="loader"></div>
  `;

  if (!userId) {
    licenciasContainer.innerHTML = `
      <h2><i class="fas fa-lock"></i> Licencias</h2>
      <p>🔒 Iniciá sesión para visualizar tus licencias activas.</p>
    `;
    return;
  }

  try {
    const licenciasRef = collection(dbLicencias, "licencias");
    console.log("Buscando licencias del usuario:", userId);
    const q = query(licenciasRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    console.log("Licencias encontradas:", querySnapshot.size);

    licenciasContainer.innerHTML = `
      <h2><i class="fas fa-id-card"></i> Tus Licencias</h2>
      <div class="licencias-list"></div>
    `;

    const listContainer = licenciasContainer.querySelector(".licencias-list");

    if (querySnapshot.empty) {
      listContainer.innerHTML = `
        <div class="info-item no-data fade-in">
          <i class="fas fa-exclamation-circle"></i>
          <span>No tenés licencias registradas actualmente.</span>
        </div>
      `;
      return;
    }

    const hoy = new Date();

querySnapshot.forEach((doc) => {
  const data = doc.data();

  const hoy = new Date();
  let fechaVenc;

  // ✅ Si Firestore guarda fechaVencimiento correctamente, la usamos
  if (data.fechaVencimiento) {
    fechaVenc = data.fechaVencimiento.toDate();
  } else {
    // 🔧 Si no la guarda o solo guarda meses, la calculamos acá
    const meses = data.meses || data.duracion || 1;
    fechaVenc = new Date(hoy);
    fechaVenc.setMonth(fechaVenc.getMonth() + meses);
  }

  // Calcular días restantes
  const diffDias = Math.ceil((fechaVenc - hoy) / (1000 * 60 * 60 * 24));

  let estadoTexto = "";
  let color = "";

  if (diffDias <= 0) {
    estadoTexto = "⛔ Vencida";
    color = "#ff4d4d";
  } else if (diffDias <= 10) {
    estadoTexto = `⚠️ Por vencer (${diffDias} días)`;
    color = "#ffcc00";
  } else {
    estadoTexto = `✅ Activa (${diffDias} días restantes)`;
    color = "#4caf50";
  }

  // Mostrar duración en meses
  const duracionTexto = data.meses
    ? `${data.meses} mes${data.meses > 1 ? "es" : ""}`
    : data.duracion
    ? `${data.duracion} mes${data.duracion > 1 ? "es" : ""}`
    : "1 mes";

// =============================
// PROGRESO DE LICENCIA
// =============================

let fechaInicio = data.fechaCreacion ? data.fechaCreacion.toDate() : null;

let progreso = 0;

if (fechaInicio && fechaVenc) {
  const total = fechaVenc - fechaInicio;
  const transcurrido = new Date() - fechaInicio;

  progreso = Math.min(100, Math.max(0, (transcurrido / total) * 100));
}

listContainer.innerHTML += `
<div class="info-item fade-in" style="border-left: 5px solid ${color};">
  <div class="licencia-info">

    <span><i class="fas fa-cube"></i> ${data.producto}</span>

    <small>Código: <strong>${data.codigo}</strong></small>

    <small>Plan: ${data.plan || duracionTexto}</small>

    <small>Duración: ${duracionTexto}</small>

    <small>Vence: ${fechaVenc.toLocaleDateString()}</small>

    <div class="licencia-progress">
      <div class="licencia-bar" style="width:${progreso}%"></div>
    </div>

  </div>

  <strong style="color:${color};">${estadoTexto}</strong>

</div>
`;
});




  } catch (error) {
    console.error("Error al cargar licencias:", error);
    licenciasContainer.innerHTML += `
      <div class="info-item error fade-in">
        <i class="fas fa-bug"></i> Error al obtener licencias. Intentalo más tarde.
      </div>
    `;
  }
}

// === FUNCIÓN: CARGAR PROMOCIONES ===
async function cargarPromociones() {
  promocionesContainer.innerHTML = `
    <h2><i class="fas fa-tags"></i> Promociones activas</h2>
    <div class="loader"></div>
  `;

  try {
    const promosRef = collection(dbLicencias, "promociones");
    const querySnapshot = await getDocs(promosRef);

    promocionesContainer.innerHTML = `
      <h2><i class="fas fa-percentage"></i> Promociones</h2>
    `;

    if (querySnapshot.empty) {
      promocionesContainer.innerHTML += `
        <div class="info-item no-data fade-in">
          <i class="fas fa-info-circle"></i>
          <span>No hay promociones disponibles en este momento.</span>
        </div>
      `;
      return;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      promocionesContainer.innerHTML += `
        <div class="info-item promo-item fade-in">
          <span>${data.descripcion}</span>
          <strong>${data.estado || "Activa"}</strong>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error al cargar promociones:", error);
    promocionesContainer.innerHTML += `
      <div class="info-item error fade-in">
        <i class="fas fa-bug"></i> Error al obtener promociones.
      </div>
    `;
  }
}

// === INICIALIZAR PANEL ===
document.addEventListener("DOMContentLoaded", () => {

  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {

    console.log("AUTH STATE:", user);

    if (!user) {
      console.log("Usuario no autenticado aún");
      return;
    }

    console.log("UID ACTUAL:", user.uid);

    const userId = user.uid;

    cargarLicencias(userId);
    cargarPromociones();

  });

});