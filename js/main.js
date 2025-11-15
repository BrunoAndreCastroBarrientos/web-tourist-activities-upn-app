// Mock de actividades para usar en landing + detalle
const ACTIVIDADES_MOCK = [
  {
    id: "citytour-cusco",
    nombre: "City tour histórico en Cusco",
    destino: "Cusco, Perú",
    tipo: "citytour",
    duracion: "4 horas",
    precioDesde: 35,
    moneda: "US$",
    rating: 4.8,
    reseñas: 320,
    dificultad: "Baja",
    imgPrincipal: "https://images.pexels.com/photos/21014/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=900",
    imgSecundaria: "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=900",
    descripcionCorta:
      "Recorrido guiado de medio día por los principales puntos históricos de la ciudad.",
    descripcionLarga:
      "Este city tour en Cusco te lleva por la Plaza de Armas, la Catedral, el Templo del Sol (Qoricancha) y complejos arqueológicos cercanos. Ideal para tu primer día de viaje, con explicaciones sobre la historia inca y colonial.",
    incluye: [
      "Guía oficial de turismo",
      "Ingreso a los puntos indicados en el itinerario",
      "Transporte turístico compartido"
    ],
    noIncluye: ["Alimentación", "Propinas", "Gastos personales"],
    puntoEncuentro: "Plaza de Armas de Cusco (frente a la Catedral)"
  },
  {
    id: "ruta-gastronomica",
    nombre: "Ruta gastronómica nocturna",
    destino: "Ciudad céntrica",
    tipo: "gastronomia",
    duracion: "3 horas",
    precioDesde: 49,
    moneda: "US$",
    rating: 4.7,
    reseñas: 89,
    dificultad: "Baja",
    imgPrincipal: "https://images.pexels.com/photos/460376/pexels-photo-460376.jpeg?auto=compress&cs=tinysrgb&w=900",
    imgSecundaria: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=900",
    descripcionCorta:
      "Descubre los sabores locales con un guía foodie en un recorrido nocturno.",
    descripcionLarga:
      "La ruta gastronómica nocturna te lleva por restaurantes y mercados tradicionales para probar platos típicos, postres y bebidas. Ideal para quienes quieren conocer la cultura a través de la comida.",
    incluye: [
      "Degustación en 4 paradas gastronómicas",
      "Guía especializado en gastronomía",
      "Una bebida por parada"
    ],
    noIncluye: ["Traslado al punto de encuentro", "Bebidas adicionales"],
    puntoEncuentro: "Plaza principal de la ciudad (frente al ayuntamiento)"
  },
  {
    id: "trekking-mirador",
    nombre: "Trekking a mirador panorámico",
    destino: "Zona montañosa",
    tipo: "aventura",
    duracion: "Día completo",
    precioDesde: 65,
    moneda: "US$",
    rating: 4.9,
    reseñas: 150,
    dificultad: "Media",
    imgPrincipal: "https://images.pexels.com/photos/547114/pexels-photo-547114.jpeg?auto=compress&cs=tinysrgb&w=900",
    imgSecundaria: "https://images.pexels.com/photos/459947/pexels-photo-459947.jpeg?auto=compress&cs=tinysrgb&w=900",
    descripcionCorta:
      "Excursión de día completo con vistas espectaculares y paisajes naturales.",
    descripcionLarga:
      "Un trekking de dificultad media que recorre senderos de montaña hasta un mirador panorámico. Incluye paradas fotográficas y tiempo para descansar y almorzar con vistas increíbles.",
    incluye: [
      "Guía de montaña certificado",
      "Transporte de ida y vuelta",
      "Snack y almuerzo ligero"
    ],
    noIncluye: ["Equipo personal (botas, bastones)", "Seguro de viaje"],
    puntoEncuentro: "Terminal de buses turísticos de la ciudad"
  }
];

function getActividadById(id) {
  return ACTIVIDADES_MOCK.find((a) => a.id === id);
}

// --- LISTO EL DOM ---
document.addEventListener("DOMContentLoaded", () => {
  initSmoothScroll();
  initLandingSearch();
  initActivityDetailPage();
  initActivityDetailLinks();
  initDashboardAnimations();
  initDashboardFilters();
  initFakeLogin();
  initContactFormFeedback();
});

/* ---------------------------
   SCROLL SUAVE EN ANCLAS
---------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });
}

/* ---------------------------
   LANDING: BUSCADOR
---------------------------- */
function initLandingSearch() {
  const searchForm = document.getElementById("search-form");
  const resultsBox = document.getElementById("search-results");

  if (!searchForm || !resultsBox) return;

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const destinoInput = document.getElementById("destino");
    const tipoSelect = document.getElementById("tipo");
    const destino = (destinoInput?.value || "").trim().toLowerCase();
    const tipo = tipoSelect?.value || "";

    const filtradas = ACTIVIDADES_MOCK.filter((act) => {
      const matchDestino =
        !destino ||
        act.destino.toLowerCase().includes(destino) ||
        act.nombre.toLowerCase().includes(destino);
      const matchTipo = !tipo || act.tipo === tipo;
      return matchDestino && matchTipo;
    });

    if (!filtradas.length) {
      resultsBox.innerHTML = `
        <div class="alert alert-warning mb-0" role="alert">
          No se encontraron actividades para esos criterios. Prueba con otro destino o tipo de actividad.
        </div>
      `;
      return;
    }

    // Render de tarjetas resultantes
    const html = filtradas
      .map(
        (act) => `
        <article class="card border-0 shadow-sm rounded-4 mb-3">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="${act.imgPrincipal}" class="img-fluid rounded-start h-100 object-fit-cover" alt="${act.nombre}">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title mb-1">${act.nombre}</h5>
                <p class="small text-muted mb-1">${act.destino} · ${act.duracion}</p>
                <p class="card-text mb-2">${act.descripcionCorta}</p>
                <div class="d-flex justify-content-between align-items-center small mb-2">
                  <span>⭐ ${act.rating} (${act.reseñas} reseñas)</span>
                  <span class="fw-semibold text-primary">${act.moneda} ${act.precioDesde}</span>
                </div>
                <button type="button"
                        class="btn btn-outline-primary btn-sm rounded-pill"
                        data-actividad-id="${act.id}">
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        </article>
      `
      )
      .join("");

    resultsBox.innerHTML = html;
    // Reasignamos eventos a botones de "Ver detalles" recién pintados
    initActivityDetailLinks(resultsBox);
  });
}

/* ---------------------------
   LINK "VER DETALLES" -> actividad-detalle.html?id=...
---------------------------- */
function initActivityDetailLinks(scope = document) {
  const detailButtons = scope.querySelectorAll("[data-actividad-id]");
  detailButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btn.getAttribute("data-actividad-id");
      if (!id) return;
      window.location.href = `actividad-detalle.html?id=${encodeURIComponent(id)}`;
    });
  });
}

/* ---------------------------
   PÁGINA DETALLE: render dinámico
---------------------------- */
function initActivityDetailPage() {
  const root = document.querySelector("[data-activity-detail-root]");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || "";
  const actividad = getActividadById(id);

  if (!actividad) {
    root.innerHTML = `
      <div class="text-center py-5">
        <h1 class="h4 mb-3">Actividad no encontrada</h1>
        <p class="text-muted mb-3">
          No se encontró la actividad solicitada. Es posible que el enlace esté incompleto.
        </p>
        <a href="index.html#actividades" class="btn btn-primary rounded-pill">
          Volver a actividades
        </a>
      </div>
    `;
    return;
  }

  root.innerHTML = `
    <section class="activity-detail-hero p-3 p-md-4 mb-4">
      <div class="row g-4">
        <div class="col-lg-7">
          <div class="activity-detail-img-main rounded-3 overflow-hidden mb-3">
            <img src="${actividad.imgPrincipal}" alt="${actividad.nombre}">
          </div>
          <div class="row g-2">
            <div class="col-6">
              <div class="rounded-3 overflow-hidden">
                <img src="${actividad.imgSecundaria}" alt="${actividad.nombre}">
              </div>
            </div>
            <div class="col-6 d-flex flex-column justify-content-center">
              <div class="activity-detail-meta mb-1">
                <span class="badge bg-primary-subtle text-primary activity-detail-badge me-1">
                  ${actividad.tipo.toUpperCase()}
                </span>
                <span class="small">⭐ ${actividad.rating} (${actividad.reseñas} reseñas)</span>
              </div>
              <p class="small text-muted mb-0">${actividad.destino}</p>
              <p class="small text-muted mb-0">Duración: ${actividad.duracion}</p>
              <p class="small text-muted mb-0">Dificultad: ${actividad.dificultad}</p>
            </div>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="activity-detail-aside-card p-3 p-md-4">
            <h1 class="h4 mb-2">${actividad.nombre}</h1>
            <p class="text-muted small mb-3">${actividad.descripcionCorta}</p>

            <div class="d-flex justify-content-between align-items-center mb-2">
              <div>
                <span class="small text-muted d-block">Precio desde</span>
                <span class="h5 mb-0 text-primary">${actividad.moneda} ${actividad.precioDesde}</span>
              </div>
              <div class="text-end small text-muted">
                <span class="d-block">${actividad.duracion}</span>
                <span class="d-block">Dificultad: ${actividad.dificultad}</span>
              </div>
            </div>

            <hr>

            <form id="detalle-reserva-form" class="small">
              <div class="mb-2">
                <label for="detalle-fecha" class="form-label mb-1">Fecha de la actividad</label>
                <input type="date" id="detalle-fecha" class="form-control form-control-sm" required>
              </div>
              <div class="mb-2">
                <label for="detalle-personas" class="form-label mb-1">Número de personas</label>
                <input type="number" id="detalle-personas" class="form-control form-control-sm"
                       min="1" value="2" required>
              </div>

              <div class="d-flex justify-content-between align-items-center my-2">
                <span class="small">Precio unitario:</span>
                <span class="small fw-semibold">
                  <span id="detalle-precio-unitario">${actividad.moneda} ${actividad.precioDesde}</span>
                </span>
              </div>

              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="small">Total estimado:</span>
                <span class="fw-semibold text-primary" id="detalle-precio-total">
                  ${actividad.moneda} ${(actividad.precioDesde * 2).toFixed(2)}
                </span>
              </div>

              <button type="submit" class="btn btn-gradient w-100 rounded-pill mb-2">
                Simular reserva
              </button>
            </form>

            <div id="detalle-reserva-feedback" class="small"></div>

            <hr>

            <p class="small text-muted mb-1">Punto de encuentro</p>
            <p class="small mb-0">${actividad.puntoEncuentro}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mb-4">
      <div class="row g-4">
        <div class="col-lg-8">
          <h2 class="h5 mb-2">Descripción de la experiencia</h2>
          <p class="text-muted small mb-3">
            ${actividad.descripcionLarga}
          </p>

          <h3 class="h6 mt-3 mb-2">Lo que debes saber</h3>
          <ul class="small text-muted mb-3">
            <li>Llega al punto de encuentro 15 minutos antes del inicio.</li>
            <li>Lleva documento de identidad y comprobante de reserva.</li>
            <li>Usa ropa y calzado cómodo acorde al clima del destino.</li>
          </ul>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm rounded-4 mb-3">
            <div class="card-body small">
              <h3 class="h6">Incluye</h3>
              <ul class="mb-0">
                ${actividad.inc
                  .cluye?.map((i) => `<li>${i}</li>`).join("") ??
                actividad.incluye.map((i) => `<li>${i}</li>`).join("")}
              </ul>
            </div>
          </div>
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body small">
              <h3 class="h6">No incluye</h3>
              <ul class="mb-0">
                ${actividad.noIncluye.map((i) => `<li>${i}</li>`).join("")}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Inicializar lógica de cálculo de total y simulación de reserva
  initDetalleReservaForm(actividad);
}

function initDetalleReservaForm(actividad) {
  const form = document.getElementById("detalle-reserva-form");
  const personasInput = document.getElementById("detalle-personas");
  const totalSpan = document.getElementById("detalle-precio-total");
  const feedback = document.getElementById("detalle-reserva-feedback");

  if (!form || !personasInput || !totalSpan || !feedback) return;

  const calcTotal = () => {
    const personas = Math.max(1, parseInt(personasInput.value || "1", 10));
    const total = personas * actividad.precioDesde;
    totalSpan.textContent = `${actividad.moneda} ${total.toFixed(2)}`;
  };

  personasInput.addEventListener("input", calcTotal);
  calcTotal();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fecha = document.getElementById("detalle-fecha")?.value || "";
    const personas = parseInt(personasInput.value || "1", 10);
    if (!fecha || personas < 1) {
      feedback.innerHTML =
        '<div class="alert alert-warning mt-2 mb-0">Completa fecha y número de personas.</div>';
      return;
    }

    feedback.innerHTML = `
      <div class="alert alert-success mt-2 mb-0" role="alert">
        Reserva simulada correctamente 🎉<br>
        Actividad: <strong>${actividad.nombre}</strong><br>
        Fecha: <strong>${fecha}</strong> · Personas: <strong>${personas}</strong><br>
        En un sistema real, aquí se enviaría la reserva al backend.
      </div>
    `;
  });
}

/* ---------------------------
   DASHBOARD: animaciones y filtros
---------------------------- */
function initDashboardAnimations() {
  // Barras de progreso con data-progress (reservas por tipo)
  const progressBars = document.querySelectorAll(".progress-bar[data-progress]");
  progressBars.forEach((bar) => {
    const target = parseInt(bar.getAttribute("data-progress") || "0", 10);
    bar.style.width = "0%";
    setTimeout(() => {
      bar.style.transition = "width 0.7s ease-out";
      bar.style.width = `${target}%`;
    }, 150);
  });

  // Ocupación simulada hoy/mañana/fin de semana
  const btnRandomizar = document.getElementById("btnRandomizar");
  if (btnRandomizar) {
    btnRandomizar.addEventListener("click", () => {
      const keys = ["hoy", "maniana", "finde"];
      keys.forEach((key) => {
        const textEl = document.querySelector(`[data-ocupacion-text="${key}"]`);
        const barEl = document.querySelector(`[data-ocupacion-bar="${key}"]`);
        if (textEl && barEl) {
          const value = Math.floor(Math.random() * 60) + 30; // 30–90%
          textEl.textContent = value + "%";
          barEl.style.width = value + "%";
        }
      });
    });
  }
}

function initDashboardFilters() {
  // Filtro de estado en tabla de reservas
  const filtroEstado = document.getElementById("filtroEstado");
  const tablaReservas = document.getElementById("tablaReservas");

  if (filtroEstado && tablaReservas) {
    filtroEstado.addEventListener("change", () => {
      const estadoFiltrar = filtroEstado.value;
      const rows = tablaReservas.querySelectorAll("tbody tr");

      rows.forEach((row) => {
        const estado = row.getAttribute("data-estado") || "";
        if (!estadoFiltrar || estadoFiltrar === estado) {
          row.classList.remove("d-none");
        } else {
          row.classList.add("d-none");
        }
      });
    });
  }
}

/* ---------------------------
   LANDING: “fake login” y feedback de contacto
---------------------------- */
function initFakeLogin() {
  const loginForm = document.getElementById("login-form");
  const feedback = document.getElementById("login-feedback");
  const emailEl = document.getElementById("login-email");

  if (!loginForm || !feedback || !emailEl) return;

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailEl.value.trim();
    if (!email) {
      feedback.textContent = "Ingresa un correo para simular el inicio de sesión.";
      feedback.classList.remove("text-muted");
      feedback.classList.add("text-danger");
      return;
    }
    feedback.classList.remove("text-danger");
    feedback.classList.add("text-success");
    feedback.textContent = `Inicio de sesión simulado para ${email}. En un entorno real se validaría contra un backend.`;
  });
}

function initContactFormFeedback() {
  const contactForm = document.getElementById("contact-form");
  const feedback = document.getElementById("contact-feedback");
  const nombreEl = document.getElementById("nombre");

  if (!contactForm || !feedback || !nombreEl) return;

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = nombreEl.value.trim() || "viajero";
    feedback.textContent = `Gracias, ${nombre}. Hemos recibido tu mensaje (simulado). En un sistema real se enviaría al equipo de soporte.`;
  });
}
