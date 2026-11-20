class LoginForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();
      const email = this.shadowRoot.querySelector("#email").value;
      const password = this.shadowRoot.querySelector("#password").value;

      this.dispatchEvent(new CustomEvent("login-submit", {
        bubbles: true,
        composed: true,
        detail: { email, password }
      }));
    });
  }

  showError(message) {
    const errorBox = this.shadowRoot.querySelector(".form-error");
    errorBox.textContent = message;
    errorBox.hidden = false;
  }

  clearError() {
    const errorBox = this.shadowRoot.querySelector(".form-error");
    errorBox.textContent = "";
    errorBox.hidden = true;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; width: 100%; }
        * { box-sizing: border-box; }
        .login-card {
          width: min(100%, 460px); margin: 0 auto; padding: 38px;
          border: 1px solid #e4eaf2; border-radius: 24px; background: #fff;
          box-shadow: 0 22px 65px rgba(28,47,82,.11);
        }
        .brand { display:flex; align-items:center; gap:12px; margin-bottom:34px; }
        .brand-mark { display:grid; place-items:center; width:44px; height:44px; border-radius:14px;
          color:#fff; background:#315efb; font:800 24px Manrope, sans-serif; }
        .brand-name { color:#14213d; font:800 18px Manrope, sans-serif; }
        .brand-caption { margin-top:2px; color:#718096; font-size:11px; letter-spacing:.08em; text-transform:uppercase; }
        .eyebrow { margin:0 0 9px; color:#315efb; font-size:11px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; }
        h1 { margin:0; color:#14213d; font:800 29px Manrope, sans-serif; letter-spacing:-.04em; }
        .intro { margin:10px 0 27px; color:#718096; font-size:14px; line-height:1.6; }
        label { display:block; margin:17px 0 8px; color:#26344d; font-size:13px; font-weight:700; }
        input { width:100%; height:48px; padding:0 14px; border:1px solid #dce4ef; border-radius:11px;
          color:#17233b; background:#fff; font:14px "DM Sans",sans-serif; }
        input:focus { outline:3px solid rgba(49,94,251,.15); border-color:#315efb; }
        button { width:100%; height:49px; margin-top:24px; border:0; border-radius:11px;
          color:#fff; background:#315efb; font-weight:700; transition:background .2s, transform .2s; }
        button:hover { background:#2449d8; transform:translateY(-1px); }
        button:focus-visible, input:focus-visible { outline:3px solid rgba(49,94,251,.25); outline-offset:2px; }
        .form-error { margin:14px 0 0; padding:11px 12px; border:1px solid #f1c8cd; border-radius:9px;
          color:#a52e3b; background:#fff4f5; font-size:12px; line-height:1.5; }
        .form-error[hidden] { display:none; }
        .helper { margin:22px 0 0; padding-top:17px; border-top:1px solid #edf0f5; color:#718096; font-size:11px; line-height:1.7; }
        @media(max-width:480px) { .login-card { padding:27px 22px; border-radius:19px; } h1 { font-size:25px; } }
      </style>
      <section class="login-card" aria-labelledby="login-title">
        <div class="brand">
          <div class="brand-mark" aria-hidden="true">A</div>
          <div><div class="brand-name">Acme School</div><div class="brand-caption">Plataforma académica</div></div>
        </div>
        <p class="eyebrow">Área administrativa</p>
        <h1 id="login-title">Bienvenido de nuevo</h1>
        <p class="intro">Ingresa tus credenciales para acceder a las herramientas de gestión de la institución.</p>
        <form novalidate>
          <label for="email">Correo electrónico</label>
          <input id="email" name="email" type="email" autocomplete="username" placeholder="nombre@acmeschool.com" required>
          <label for="password">Contraseña</label>
          <input id="password" name="password" type="password" autocomplete="current-password" placeholder="Ingresa tu contraseña" required>
          <button type="submit">Iniciar sesión</button>
          <p class="form-error" role="alert" aria-live="polite" hidden></p>
        </form>
        <p class="helper">Acceso exclusivo para personal administrativo y docente autorizado.</p>
      </section>
    `;
  }
}

customElements.define("login-form", LoginForm);
