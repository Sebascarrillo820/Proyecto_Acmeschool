import { storage } from "./services/storage.js";
import { authService } from "./services/auth.js";
import "./components/login-form.js";
import "./components/app-header.js";

const app = document.querySelector("#app");

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
          <div class="side-footnote">Plataforma académica · Versión inicial</div>
        </div>
        <login-form></login-form>
      </div>
      <footer class="login-footer">© ${new Date().getFullYear()} Acme School. Plataforma académica.</footer>
    </main>
  `;

  app.querySelector("login-form").addEventListener("login-submit", handleLogin);
}

function renderDashboard(user) {
  const isAdmin = user.role.toLowerCase() === "administrativo";
  app.innerHTML = `
    <app-header user-name="${escapeAttribute(user.fullName)}" user-role="${escapeAttribute(user.role)}"></app-header>
    <main class="page-container dashboard-main">
      <section class="welcome-panel">
        <div class="welcome-copy">
          <p class="eyebrow">PANEL PRINCIPAL</p>
          <h1 class="page-title">¡Hola, ${escapeHTML(user.fullName)}!</h1>
          <p class="page-subtitle">Has iniciado sesión correctamente en la plataforma de Acme School. Desde aquí construiremos las herramientas para administrar y realizar evaluaciones.</p>
        </div>
        <div class="welcome-icon" aria-hidden="true">✦</div>
      </section>
      <section class="info-grid" aria-label="Información de la plataforma">
        <article class="info-card">
          <div class="card-icon" aria-hidden="true">♙</div>
          <h3>Gestión de usuarios</h3>
          <p>${isAdmin ? "En el Día 2 habilitaremos la creación, consulta, actualización y eliminación de usuarios." : "El módulo de administración de usuarios estará disponible según los permisos asignados."}</p>
        </article>
        <article class="info-card">
          <div class="card-icon" aria-hidden="true">▤</div>
          <h3>Gestión de exámenes</h3>
          <p>Próximamente podrás configurar exámenes, preguntas, opciones de respuesta y porcentajes de aprobación.</p>
        </article>
        <article class="info-card">
          <div class="card-icon" aria-hidden="true">◷</div>
          <h3>Resolución de exámenes</h3>
          <p>El módulo público para estudiantes se incorporará durante el Día 3 del proyecto.</p>
        </article>
      </section>
      <div class="status-note"><strong>Autenticación activa.</strong> Tu sesión se conserva al actualizar la página. Utiliza «Cerrar sesión» para salir de forma segura de esta sesión local.</div>
    </main>
  `;

  app.querySelector("app-header").addEventListener("logout-request", handleLogout);
}

function handleLogin(event) {
  const { email, password } = event.detail;
  const loginForm = app.querySelector("login-form");

  if (!email.trim() || !password) {
    loginForm.showError("Completa el correo electrónico y la contraseña.");
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

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function escapeAttribute(value) {
  return escapeHTML(value);
}

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
