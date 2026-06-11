// base de la API
const API_URL = "https://api-colombia.com/api/v1";

// funcion que hace el fetch - la reutilizo en todas
async function consumirAPI(endpoint) {
  try {
    const respuesta = await fetch(API_URL + endpoint);

    if (!respuesta.ok) {
      throw new Error("Error " + respuesta.status + " al consultar la API");
    }

    const datos = await respuesta.json();
    return datos;

  } catch (error) {
    mostrarError(error.message);
    return null;
  }
}

// ================================================
// FUNCIÓN 1 - DEPARTAMENTOS
// /search/ devuelve un ARRAY - hay que recorrerlo
// campos reales: name, municipalities, surface, population, phonePrefix, description
// ================================================
async function buscarDepartamento() {
  const nombre = document.getElementById("nombreDepartamento").value.trim();

  if (!nombre) {
    alert("Escribe el nombre de un departamento");
    return;
  }

  mostrarCargando();

  const datos = await consumirAPI("/Department/search/" + nombre);

  if (datos === null) return;

  if (datos.length === 0) {
    mostrarError("No se encontró ningún departamento con ese nombre.");
    return;
  }

  let html = "<p>Se encontraron <strong>" + datos.length + "</strong> resultado(s):</p>";

  for (let i = 0; i < datos.length; i++) {
    const dep = datos[i];
    html += `
      <div class="item-card">
        <h3>${dep.name} <span class="badge">Departamento</span></h3>
        <p><strong>Municipios:</strong> ${dep.municipalities || "No disponible"}</p>
        <p><strong>Superficie:</strong> ${dep.surface ? dep.surface.toLocaleString() + " km²" : "No disponible"}</p>
        <p><strong>Población:</strong> ${dep.population ? dep.population.toLocaleString() + " hab." : "No disponible"}</p>
        <p><strong>Prefijo tel:</strong> ${dep.phonePrefix ? "+" + dep.phonePrefix : "No disponible"}</p>
        <p><strong>Descripción:</strong> ${dep.description ? dep.description.substring(0, 200) + "..." : "Sin descripción"}</p>
      </div>
    `;
  }

  document.getElementById("resultado").innerHTML = html;
}

async function todosLosDepartamentos() {
  mostrarCargando();

  const datos = await consumirAPI("/Department");

  if (datos === null) return;

  let html = "<p>Colombia tiene <strong>" + datos.length + "</strong> departamentos:</p>";

  for (let i = 0; i < datos.length; i++) {
    const dep = datos[i];
    html += `
      <div class="item-card">
        <h3>${dep.name}</h3>
        <p><strong>Municipios:</strong> ${dep.municipalities || "No disponible"}</p>
        <p><strong>Población:</strong> ${dep.population ? dep.population.toLocaleString() + " hab." : "No disponible"}</p>
      </div>
    `;
  }

  document.getElementById("resultado").innerHTML = html;
}

// ================================================
// FUNCIÓN 2 - CIUDADES
// /search/ devuelve un ARRAY
// campos reales confirmados: name, surface, population, description
// ================================================
async function buscarCiudad() {
  const nombre = document.getElementById("nombreCiudad").value.trim();

  if (!nombre) {
    alert("Escribe el nombre de una ciudad");
    return;
  }

  mostrarCargando();

  const datos = await consumirAPI("/City/search/" + nombre);

  if (datos === null) return;

  if (datos.length === 0) {
    mostrarError("No encontré ninguna ciudad con ese nombre.");
    return;
  }

  let html = "<p>Encontré <strong>" + datos.length + "</strong> ciudad(es):</p>";

  for (let i = 0; i < datos.length; i++) {
    const ciudad = datos[i];
    html += `
      <div class="item-card">
        <h3>${ciudad.name} <span class="badge">Ciudad</span></h3>
        <p><strong>Superficie:</strong> ${ciudad.surface ? ciudad.surface + " km²" : "No disponible"}</p>
        <p><strong>Población:</strong> ${ciudad.population ? ciudad.population.toLocaleString() + " hab." : "No disponible"}</p>
        <p><strong>Descripción:</strong> ${ciudad.description ? ciudad.description.substring(0, 200) + "..." : "Sin descripción"}</p>
      </div>
    `;
  }

  document.getElementById("resultado").innerHTML = html;
}

// ================================================
// FUNCIÓN 3 - PRESIDENTES
// /search/ devuelve un ARRAY
// campos reales: name, lastName, startPeriodDate, endPeriodDate, politicalParty, description
// ================================================
async function buscarPresidente() {
  const nombre = document.getElementById("nombrePresidente").value.trim();

  if (!nombre) {
    alert("Escribe el nombre del presidente");
    return;
  }

  mostrarCargando();

  const datos = await consumirAPI("/President/search/" + nombre);

  if (datos === null) return;

  if (datos.length === 0) {
    mostrarError("No encontré ningún presidente con ese nombre.");
    return;
  }

  let html = "<p>Encontré <strong>" + datos.length + "</strong> resultado(s):</p>";

  for (let i = 0; i < datos.length; i++) {
    const pres = datos[i];
    html += `
      <div class="item-card">
        <h3>${pres.name} ${pres.lastName} <span class="badge">Presidente</span></h3>
        <p><strong>Periodo:</strong> ${pres.startPeriodDate || "?"} — ${pres.endPeriodDate || "En curso"}</p>
        <p><strong>Partido:</strong> ${pres.politicalParty || "No disponible"}</p>
        <p><strong>Descripción:</strong> ${pres.description ? pres.description.substring(0, 200) + "..." : "Sin descripción"}</p>
      </div>
    `;
  }

  document.getElementById("resultado").innerHTML = html;
}

async function todosLosPresidentes() {
  mostrarCargando();

  const datos = await consumirAPI("/President");

  if (datos === null) return;

  let html = "<p>Colombia ha tenido <strong>" + datos.length + "</strong> presidentes:</p>";

  for (let i = 0; i < datos.length; i++) {
    const pres = datos[i];
    html += `
      <div class="item-card">
        <h3>${pres.name} ${pres.lastName}</h3>
        <p><strong>Periodo:</strong> ${pres.startPeriodDate || "?"} — ${pres.endPeriodDate || "En curso"}</p>
        <p><strong>Partido:</strong> ${pres.politicalParty || "No registrado"}</p>
      </div>
    `;
  }

  document.getElementById("resultado").innerHTML = html;
}

// ================================================
// FUNCIONES DE AYUDA
// ================================================
function mostrarCargando() {
  document.getElementById("resultado").innerHTML = "<p class='loading'>⏳ Consultando la API...</p>";
}

function mostrarError(mensaje) {
  document.getElementById("resultado").innerHTML = "<p class='error'>❌ " + mensaje + "</p>";
}