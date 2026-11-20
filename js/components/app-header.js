class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const name = this.getAttribute("user-name") || "Usuario";
    const role = this.getAttribute("user-role") || "Personal";
    this.shadowRoot.innerHTML = `
      <style>
        :host { display:block; background:#fff; border-bottom:1px solid #e4eaf2; }
        * { box-sizing:border-box; }
        header { width:min(1120px,calc(100% - 40px)); min-height:76px; margin:auto; display:flex;
          align-items:center; justify-content:space-between; gap:16px; }
        .brand { display:flex; align-items:center; gap:11px; color:#14213d; font:800 17px Manrope,sans-serif; }
        .mark { display:grid; place-items:center; width:38px; height:38px; border-radius:12px;
          color:white; background:#315efb; font-size:21px; }
        .user-area { display:flex; align-items:center; gap:16px; }
        .user-copy { text-align:right; }
        .user-name { color:#26344d; font-size:13px; font-weight:700; }
        .user-role { margin-top:3px; color:#718096; font-size:11px; }
        button { padding:10px 14px; border:1px solid #e0e6ef; border-radius:9px; color:#34415a;
          background:#fff; font-size:12px; font-weight:700; }
        button:hover { border-color:#315efb; color:#315efb; }
        button:focus-visible { outline:3px solid rgba(49,94,251,.2); outline-offset:2px; }
        @media(max-width:560px) {
          header { width:calc(100% - 28px); min-height:68px; }
          .brand { font-size:14px; } .mark { width:34px; height:34px; }
          .user-area { gap:9px; } .user-name { max-width:115px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
          button { padding:9px 10px; }
        }
      </style>
      <header>
        <div class="brand"><span class="mark" aria-hidden="true">A</span><span>Acme School</span></div>
        <div class="user-area">
          <div class="user-copy"><div class="user-name">${this.escapeHTML(name)}</div><div class="user-role">${this.escapeHTML(role)}</div></div>
          <button type="button" id="logout-button">Cerrar sesión</button>
        </div>
      </header>
    `;
    this.shadowRoot.querySelector("#logout-button").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("logout-request", { bubbles: true, composed: true }));
    });
  }

  escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }
}

customElements.define("app-header", AppHeader);
