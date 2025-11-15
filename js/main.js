document.addEventListener("DOMContentLoaded", () => {
  // Scroll suave para anclas internas
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  // --- LANDING: manejo simple del buscador ---
  const searchForm = document.getElementById("search-form");
  const resultsBox = document.getElementById("search-results");

  if (searchForm && resultsBox) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const destino = document.getElementById("destino")?.value.trim() || "cualquier destino";
      const fecha = document.getElementById("fecha")?.value || "próximas fechas";
      const tipoSelect = document.getElementById("tipo");
      const tipo = tipoSelect && tipoSelect.value
        ? tipoSelect.options[tipoSelect.selectedIndex].text
        : "cualquier tipo de actividad";

      resultsBox.innerHTML = `
        <div class="alert alert-info mb-0" role="alert">
          <strong>Simulación de búsqueda:</strong><br/>
          Mostrando resultados para <strong>${destino}</strong>,
          en <strong>${fecha}</strong>, tipo <strong>${tipo}</strong>.<br/>
          En un sistema real, aquí se listarían las actividades desde el backend.
        </div>
      `;
    });
  }

  // --- DASHBOARD: animar barras de progreso ---
  const progressBars = document.querySelectorAll(".progress-bar[data-progress]");
  progressBars.forEach((bar) => {
    const target = parseInt(bar.getAttribute("data-progress") || "0", 10);
    bar.style.width = "0%";
    setTimeout(() => {
      bar.style.transition = "width 0.7s ease-out";
      bar.style.width = `${target}%`;
    }, 150);
  });

  // --- DASHBOARD: botón para “simular” ocupación ---
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

  // --- DASHBOARD: filtro de estado en tabla de reservas ---
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
});
