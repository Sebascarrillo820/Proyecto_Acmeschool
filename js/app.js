
import { storage } from "./services/storage.js";
import { authService } from "./services/auth.js";

import "./components/exam-taking.js";
import "./components/login-form.js";
import "./components/app-header.js";
import "./components/management-components.js";

const app = document.querySelector("#app");

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

// ==========================================
// PANTALLA DE LOGIN
// ==========================================

function renderLogin() {
  app.innerHTML = `
    <main class="login-page">
      <div class="login-decoration decoration-one"></div>
      <div class="login-decoration decoration-two"></div>

      <div class="login-content">
        <div class="login-side-copy">
          <p class="eyebrow">ACME SCHOOL · EXÁMENES</p>
          <h2>La educación avanza cuando el conocimiento encuentra nuevas formas.</h2>
          <p>Un espacio centralizado para administrar evaluaciones y acompañar el aprendizaje.</p>
          <div class="side-footnote">Plataforma académica</div>
        </div>

        <login-form></login-form>
        <button class="public-exams-link" id="open-public-exams" type="button">
         Presentar un examen como estudiante
        </button>
      </div>

      <footer class="login-footer">
        © ${new Date().getFullYear()} Acme School.
      </footer>
    </main>
  `;

  app.querySelector("login-form").addEventListener(
    "login-submit",
    handleLogin
  );

  app.querySelector("#open-public-exams").addEventListener(
    "click", 
    renderPublicExams
  );
}

// ==========================================
// PANEL PRINCIPAL
// ==========================================

function renderDashboard(user, activeSection = "home") {
  const navigation = [
    { id: "home", label: "Inicio", icon: "⌂" },
    { id: "users", label: "Gestión de usuarios", icon: "♙" },
    { id: "exams", label: "Gestión de exámenes", icon: "▤" }
  ];

  let content = "";

  if (activeSection === "users") {
    content = `
      <p class="eyebrow">ADMINISTRACIÓN</p>
      <h1 class="page-title">Gestión de usuarios</h1>
      <p class="page-subtitle">
        Registra, consulta, actualiza y elimina usuarios de Acme School.
      </p>

      <user-management current-user-id="${escapeHTML(user.userId)}"></user-management>
    `;
  } else if (activeSection === "exams") {
    content = `
      <p class="eyebrow">EVALUACIONES</p>
      <h1 class="page-title">Gestión de exámenes</h1>
      <p class="page-subtitle">
        Crea exámenes, configura su duración y agrega preguntas con sus respuestas.
      </p>

      <exam-management></exam-management>
    `;
  } else {
    content = `
      <section class="welcome-panel">
        <div class="welcome-copy">
          <p class="eyebrow">PANEL PRINCIPAL</p>
          <h1 class="page-title">
            ¡Hola, ${escapeHTML(user.fullName)}!
          </h1>
          <p class="page-subtitle">
            Bienvenido a Acme School. Desde aquí puedes administrar
            los usuarios y configurar los exámenes de la institución.
          </p>
        </div>

        <div class="welcome-icon" aria-hidden="true">✦</div>
      </section>

      <section class="info-grid">
        <article class="info-card">
          <div class="card-icon">♙</div>
          <h3>Gestión de usuarios</h3>
          <p>
            Registra, consulta, actualiza y elimina las cuentas del personal.
          </p>
          <button class="home-link" data-go="users">
            Abrir módulo →
          </button>
        </article>

        <article class="info-card">
          <div class="card-icon">▤</div>
          <h3>Gestión de exámenes</h3>
          <p>
            Configura evaluaciones, preguntas y respuestas correctas.
          </p>
          <button class="home-link" data-go="exams">
            Abrir módulo →
          </button>
        </article>

        <article class="info-card">
          <div class="card-icon">◷</div>
          <h3>Resolución de exámenes</h3>
          <p>
            El módulo público para estudiantes se implementará en el Día 3.
          </p>
          <span class="coming-soon">Próximamente</span>
        </article>
      </section>

      <div class="status-note">
        <strong>Sesión activa.</strong>
        La información de usuarios y exámenes se guarda en localStorage.
      </div>
    `;
  }

  app.innerHTML = `
    <app-header
      user-name="${escapeHTML(user.fullName)}"
      user-role="${escapeHTML(user.role)}">
    </app-header>

    <div class="workspace">
      <aside class="sidebar">
        <p class="sidebar-label">MENÚ PRINCIPAL</p>

        ${navigation.map(item => `
          <button
            type="button"
            class="nav-item ${activeSection === item.id ? "active" : ""}"
            data-go="${item.id}">
            <span>${item.icon}</span>
            ${item.label}
          </button>
        `).join("")}

        <div class="sidebar-note">
          Acme School
          <span>Plataforma académica</span>
        </div>
      </aside>

      <main class="page-container dashboard-main">
        ${content}
      </main>
    </div>
  `;

  app.querySelector("app-header").addEventListener(
    "logout-request",
    handleLogout
  );

  app.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => {
      renderDashboard(user, button.dataset.go);
    });
  });
}

// ==========================================
// AUTENTICACIÓN
// ==========================================

function handleLogin(event) {
  const { email, password } = event.detail;
  const loginForm = app.querySelector("login-form");

  if (!email.trim() || !password) {
    loginForm.showError("Completa el correo y la contraseña.");
    return;
  }

  const result = authService.login(email, password);

  if (!result.success) {
    loginForm.showError(result.message);
    return;
  }

  renderDashboard(result.user);
}

function handleLogout() {
  authService.logout();
  renderLogin();
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

function startApp() {
  storage.initialize();

  const currentUser = authService.getCurrentUser();

  if (currentUser) {
    renderDashboard(currentUser);
  } else {
    renderLogin();
  }
}

startApp();
 
function renderPublicExams() {
  app.innerHTML = `<exam-taking></exam-taking>`;

  app.querySelector("exam-taking").addEventListener("back-to-login", renderLogin);
}