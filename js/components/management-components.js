
import { userService } from "../services/users.js";
import { examService } from "../services/exams.js";

const componentStyles = `
  :host {
    display: block;
    color: #17233b;
    font-family: "DM Sans", sans-serif;
  }

  * { box-sizing: border-box; }

  .layout {
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 20px;
    align-items: start;
  }

  .panel {
    padding: 22px;
    background: white;
    border: 1px solid #e4eaf2;
    border-radius: 16px;
  }

  h2 { margin: 0; font: 800 19px Manrope, sans-serif; }
  h3 { font-size: 14px; }

  .muted {
    color: #718096;
    font-size: 13px;
    line-height: 1.6;
    margin-bottom: 18px;
  }

  .table-wrap { overflow-x: auto; }

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 500px;
  }

  th, td {
    padding: 12px 9px;
    border-bottom: 1px solid #edf0f5;
    text-align: left;
    font-size: 12px;
  }

  th {
    color: #718096;
    font-size: 10px;
    text-transform: uppercase;
  }

  td { color: #34415a; }

  label {
    display: block;
    margin: 13px 0 6px;
    font-size: 12px;
    font-weight: 700;
  }

  input, select, textarea {
    width: 100%;
    padding: 11px;
    border: 1px solid #dce4ef;
    border-radius: 9px;
    background: white;
    color: #17233b;
    font: 13px "DM Sans", sans-serif;
  }

  input, select { height: 42px; }
  textarea { min-height: 70px; resize: vertical; }

  input:focus, select:focus, textarea:focus {
    outline: 2px solid #dce4ff;
    border-color: #315efb;
  }

  button {
    padding: 9px 11px;
    border: 0;
    border-radius: 8px;
    font: 700 11px "DM Sans", sans-serif;
    cursor: pointer;
  }

  button:disabled { opacity: .45; cursor: not-allowed; }

  .primary {
    width: 100%;
    margin-top: 17px;
    padding: 12px;
    background: #315efb;
    color: white;
  }

  .secondary { background: #edf1f7; color: #536078; }
  .edit { background: #edf1ff; color: #315efb; }
  .delete { background: #fff0f1; color: #b63845; }
  .add { margin-top: 10px; background: #edf1ff; color: #315efb; }

  .actions { display: flex; gap: 5px; }

  .notice {
    padding: 11px;
    margin-bottom: 14px;
    border-radius: 8px;
    font-size: 12px;
  }

  .success { background: #effaf4; color: #176b4c; }
  .error { background: #fff0f1; color: #a52e3b; }

  .empty {
    padding: 22px;
    color: #8491a4;
    text-align: center;
    font-size: 13px;
  }

  .question-card {
    margin-top: 15px;
    padding: 14px;
    border: 1px solid #e4eaf2;
    border-radius: 12px;
    background: #fbfcfe;
  }

  .question-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .answer-row {
    display: grid;
    grid-template-columns: 22px 1fr auto;
    align-items: center;
    gap: 7px;
    margin-top: 8px;
  }

  .answer-row input[type="radio"] {
    width: 16px;
    height: 16px;
    accent-color: #315efb;
  }

  .answer-row input[type="text"] { height: 38px; }

  .hint { color: #8491a4; font-size: 10px; line-height: 1.5; }

  @media(max-width: 850px) {
    .layout { grid-template-columns: 1fr; }
  }

  @media(max-width: 480px) {
    .panel { padding: 15px; }
    .actions { flex-wrap: wrap; }
  }
`;

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
}

function showNotice(root, message, type = "success") {
  const notice = root.querySelector(".notice");
  notice.textContent = message;
  notice.className = `notice ${type}`;
  notice.hidden = false;
}

// ==========================================
// COMPONENTE: GESTIÓN DE USUARIOS
// ==========================================

class UserManagement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.editingId = null;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const users = userService.getAll();
    const currentId = this.getAttribute("current-user-id");

    this.shadowRoot.innerHTML = `
      <style>${componentStyles}</style>

      <div class="notice" hidden></div>

      <div class="layout">
        <section class="panel">
          <h2>Usuarios registrados</h2>
          <p class="muted">Consulta y administra los usuarios de Acme School.</p>

          ${users.length ? `
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Identificación</th>
                    <th>Cargo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  ${users.map(user => `
                    <tr>
                      <td>
                        <strong>${escapeHTML(user.fullName)}</strong><br>
                        ${escapeHTML(user.email)}
                      </td>
                      <td>${escapeHTML(user.identification)}</td>
                      <td>${escapeHTML(user.role)}</td>
                      <td>
                        <div class="actions">
                          <button class="edit" data-edit="${escapeHTML(user.id)}">Editar</button>
                          <button class="delete" data-delete="${escapeHTML(user.id)}"
                            ${user.id === currentId ? "disabled title='No puedes eliminar tu propia cuenta'" : ""}>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          ` : `<div class="empty">No hay usuarios registrados.</div>`}
        </section>

        <section class="panel">
          <h2>${this.editingId ? "Actualizar usuario" : "Registrar usuario"}</h2>
          <p class="muted">Completa los datos del formulario.</p>

          <form id="user-form" novalidate>
            <label>Identificación</label>
            <input name="identification" required maxlength="30">

            <label>Nombre completo</label>
            <input name="fullName" required maxlength="100">

            <label>Correo electrónico</label>
            <input name="email" type="email" required maxlength="120">

            <label>Teléfono</label>
            <input name="phone" type="tel" maxlength="25">

            <label>Cargo</label>
            <select name="role">
              <option value="Administrativo">Administrativo</option>
              <option value="Docente">Docente</option>
            </select>

            <label>Contraseña ${this.editingId ? "(opcional)" : ""}</label>
            <input name="password" type="password"
              ${this.editingId ? "" : "required"}
              placeholder="${this.editingId ? "Dejar vacío para conservarla" : "Contraseña"}">

            <button class="primary" type="submit">
              ${this.editingId ? "Guardar cambios" : "Registrar usuario"}
            </button>

            ${this.editingId ? `
              <button class="secondary" id="cancel" type="button">
                Cancelar
              </button>
            ` : ""}
          </form>
        </section>
      </div>
    `;

    const form = this.shadowRoot.querySelector("#user-form");

    if (this.editingId) {
      const user = users.find(item => item.id === this.editingId);

      if (user) {
        for (const field of ["identification", "fullName", "email", "phone", "role"]) {
          form.elements[field].value = user[field] || "";
        }
      }
    }

    form.addEventListener("submit", event => this.handleSubmit(event));

    this.shadowRoot.querySelectorAll("[data-edit]").forEach(button => {
      button.addEventListener("click", () => {
        this.editingId = button.dataset.edit;
        this.render();
      });
    });

    this.shadowRoot.querySelectorAll("[data-delete]").forEach(button => {
      button.addEventListener("click", () => this.handleDelete(button.dataset.delete));
    });

    this.shadowRoot.querySelector("#cancel")?.addEventListener("click", () => {
      this.editingId = null;
      this.render();
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const data = Object.fromEntries(
      new FormData(event.currentTarget).entries()
    );

    if (!data.identification.trim() || !data.fullName.trim() ||
        !data.email.trim() || !data.role) {
      showNotice(this.shadowRoot, "Completa todos los campos obligatorios.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      showNotice(this.shadowRoot, "Introduce un correo válido.", "error");
      return;
    }

    if (!this.editingId && !data.password) {
      showNotice(this.shadowRoot, "La contraseña es obligatoria.", "error");
      return;
    }

    const result = this.editingId
      ? userService.update(this.editingId, data)
      : userService.create(data);

    if (!result.success) {
      showNotice(this.shadowRoot, result.message, "error");
      return;
    }

    const wasEditing = Boolean(this.editingId);
    this.editingId = null;
    this.render();

    showNotice(
      this.shadowRoot,
      wasEditing ? "Usuario actualizado correctamente." : "Usuario registrado correctamente."
    );
  }

  handleDelete(id) {
    if (id === this.getAttribute("current-user-id")) {
      showNotice(this.shadowRoot, "No puedes eliminar tu propia cuenta.", "error");
      return;
    }

    const user = userService.getAll().find(item => item.id === id);

    if (!user || !confirm(`¿Eliminar a ${user.fullName}?`)) return;

    const result = userService.remove(id);
    this.render();

    showNotice(
      this.shadowRoot,
      result.success ? "Usuario eliminado correctamente." : result.message,
      result.success ? "success" : "error"
    );
  }
}

// ==========================================
// COMPONENTE: GESTIÓN DE EXÁMENES
// ==========================================

class ExamManagement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.editingId = null;
    this.questions = [];
  }

  connectedCallback() {
    this.render();
  }

  getFormData() {
    const form = this.shadowRoot.querySelector("#exam-form");

    return {
      code: form.elements.code.value,
      title: form.elements.title.value,
      time: form.elements.time.value,
      passingPercentage: form.elements.passingPercentage.value,
      description: form.elements.description.value
    };
  }

  readQuestions() {
    this.shadowRoot.querySelectorAll("[data-question]").forEach(input => {
      const question = this.questions.find(item => item.id === input.dataset.question);
      if (question) question.text = input.value;
    });

    this.shadowRoot.querySelectorAll("[data-answer]").forEach(input => {
      const question = this.questions.find(item => item.id === input.dataset.questionId);
      const answer = question?.answers.find(item => item.id === input.dataset.answer);

      if (answer) answer.text = input.value;
    });
  }

  render() {
    const exams = examService.getAll();

    this.shadowRoot.innerHTML = `
      <style>${componentStyles}</style>

      <div class="notice" hidden></div>

      <div class="layout">
        <section class="panel">
          <h2>Exámenes registrados</h2>
          <p class="muted">Consulta y administra las evaluaciones.</p>

          ${exams.length ? `
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Título</th>
                    <th>Tiempo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  ${exams.map(exam => `
                    <tr>
                      <td>${escapeHTML(exam.code)}</td>
                      <td>${escapeHTML(exam.title)}</td>
                      <td>${Number(exam.time)} min</td>
                      <td>
                        <div class="actions">
                          <button class="edit" data-edit="${escapeHTML(exam.id)}">Editar</button>
                          <button class="delete" data-delete="${escapeHTML(exam.id)}">Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          ` : `<div class="empty">Todavía no hay exámenes registrados.</div>`}
        </section>

        <section class="panel">
          <h2>${this.editingId ? "Actualizar examen" : "Crear examen"}</h2>
          <p class="muted">Configura el examen y sus preguntas.</p>

          <form id="exam-form" novalidate>
            <label>Código</label>
            <input name="code" maxlength="30" required>

            <label>Título</label>
            <input name="title" maxlength="100" required>

            <label>Tiempo en minutos</label>
            <input name="time" type="number" min="1" max="600" required>

            <label>Porcentaje de aprobación</label>
            <input name="passingPercentage" type="number" min="1" max="100" required>

            <label>Descripción</label>
            <textarea name="description" maxlength="1000"></textarea>

            <h3>Preguntas del examen</h3>

            <div id="questions">
              ${this.questions.map((question, index) => this.renderQuestion(question, index)).join("")}
            </div>

            <button type="button" class="add" id="add-question">
              + Agregar pregunta
            </button>

            <button type="submit" class="primary">
              ${this.editingId ? "Guardar cambios" : "Crear examen"}
            </button>

            ${this.editingId ? `
              <button type="button" class="secondary" id="cancel">
                Cancelar edición
              </button>
            ` : ""}
          </form>
        </section>
      </div>
    `;

    const form = this.shadowRoot.querySelector("#exam-form");

    if (this.editingId) {
      const exam = exams.find(item => item.id === this.editingId);

      if (exam) {
        for (const field of ["code", "title", "time", "passingPercentage", "description"]) {
          form.elements[field].value = exam[field] ?? "";
        }
      }
    }

    form.addEventListener("submit", event => this.handleSubmit(event));

    this.shadowRoot.querySelector("#add-question").addEventListener("click", () => {
      this.readQuestions();

      this.questions.push({
        id: createId("question"),
        text: "",
        answers: [
          { id: createId("answer"), text: "", correct: true },
          { id: createId("answer"), text: "", correct: false }
        ]
      });

      this.render();
    });

    this.shadowRoot.querySelectorAll("[data-edit]").forEach(button => {
      button.addEventListener("click", () => this.loadExam(button.dataset.edit));
    });

    this.shadowRoot.querySelectorAll("[data-delete]").forEach(button => {
      button.addEventListener("click", () => this.handleDelete(button.dataset.delete));
    });

    this.shadowRoot.querySelectorAll("[data-remove-question]").forEach(button => {
      button.addEventListener("click", () => {
        this.readQuestions();
        this.questions = this.questions.filter(
          item => item.id !== button.dataset.removeQuestion
        );
        this.render();
      });
    });

    this.shadowRoot.querySelectorAll("[data-add-answer]").forEach(button => {
      button.addEventListener("click", () => {
        this.readQuestions();

        const question = this.questions.find(
          item => item.id === button.dataset.addAnswer
        );

        if (question) {
          question.answers.push({
            id: createId("answer"),
            text: "",
            correct: false
          });
        }

        this.render();
      });
    });

    this.shadowRoot.querySelectorAll("[data-remove-answer]").forEach(button => {
      button.addEventListener("click", () => {
        this.readQuestions();

        const question = this.questions.find(
          item => item.id === button.dataset.questionId
        );

        if (!question || question.answers.length <= 2) {
          showNotice(this.shadowRoot, "Debes conservar al menos dos respuestas.", "error");
          return;
        }

        question.answers = question.answers.filter(
          item => item.id !== button.dataset.removeAnswer
        );

        if (!question.answers.some(answer => answer.correct)) {
          question.answers[0].correct = true;
        }

        this.render();
      });
    });

    this.shadowRoot.querySelectorAll("[data-correct]").forEach(radio => {
      radio.addEventListener("change", () => {
        const question = this.questions.find(
          item => item.id === radio.dataset.questionId
        );

        if (question) {
          question.answers.forEach(answer => {
            answer.correct = answer.id === radio.value;
          });
        }
      });
    });

    this.shadowRoot.querySelector("#cancel")?.addEventListener("click", () => {
      this.editingId = null;
      this.questions = [];
      this.render();
    });
  }

  renderQuestion(question, index) {
    return `
      <div class="question-card">
        <div class="question-head">
          <strong>Pregunta ${index + 1}</strong>
          <button type="button" class="delete"
            data-remove-question="${escapeHTML(question.id)}">
            Eliminar
          </button>
        </div>

        <label>Enunciado</label>
        <textarea data-question="${escapeHTML(question.id)}"
          placeholder="Escribe la pregunta">${escapeHTML(question.text)}</textarea>

        ${question.answers.map((answer, answerIndex) => `
          <div class="answer-row">
            <input type="radio"
              name="correct-${escapeHTML(question.id)}"
              value="${escapeHTML(answer.id)}"
              data-correct
              data-question-id="${escapeHTML(question.id)}"
              aria-label="Marcar respuesta ${answerIndex + 1} como correcta"
              ${answer.correct ? "checked" : ""}>

            <input type="text"
              data-answer="${escapeHTML(answer.id)}"
              data-question-id="${escapeHTML(question.id)}"
              value="${escapeHTML(answer.text)}"
              placeholder="Respuesta ${answerIndex + 1}">

            <button type="button" class="delete"
              data-remove-answer="${escapeHTML(answer.id)}"
              data-question-id="${escapeHTML(question.id)}">
              ×
            </button>
          </div>
        `).join("")}

        <button type="button" class="add" data-add-answer="${escapeHTML(question.id)}">
          + Agregar respuesta
        </button>

        <p class="hint">Selecciona el círculo de la respuesta correcta. Solo puede existir una por pregunta.</p>
      </div>
    `;
  }

  loadExam(id) {
    const exam = examService.getAll().find(item => item.id === id);
    if (!exam) return;

    this.editingId = id;

    this.questions = (exam.questions || []).map(question => ({
      id: question.id || createId("question"),
      text: question.text,
      answers: question.answers.map(answer => ({
        id: answer.id || createId("answer"),
        text: answer.text,
        correct: Boolean(answer.correct)
      }))
    }));

    this.render();
  }

  handleSubmit(event) {
    event.preventDefault();

    const data = this.getFormData();
    this.readQuestions();

    if (!data.code.trim() || !data.title.trim()) {
      showNotice(this.shadowRoot, "El código y el título son obligatorios.", "error");
      return;
    }

    if (!Number.isInteger(Number(data.time)) ||
        Number(data.time) < 1 || Number(data.time) > 600) {
      showNotice(this.shadowRoot, "El tiempo debe estar entre 1 y 600 minutos.", "error");
      return;
    }

    if (!Number.isInteger(Number(data.passingPercentage)) ||
        Number(data.passingPercentage) < 1 ||
        Number(data.passingPercentage) > 100) {
      showNotice(this.shadowRoot, "El porcentaje debe estar entre 1 y 100.", "error");
      return;
    }

    if (this.questions.length === 0) {
      showNotice(this.shadowRoot, "Agrega al menos una pregunta.", "error");
      return;
    }

    for (let i = 0; i < this.questions.length; i++) {
      const question = this.questions[i];

      if (!question.text.trim()) {
        showNotice(this.shadowRoot, `Completa la pregunta ${i + 1}.`, "error");
        return;
      }

      if (question.answers.length < 2 ||
          question.answers.some(answer => !answer.text.trim())) {
        showNotice(this.shadowRoot, `La pregunta ${i + 1} necesita al menos dos respuestas completas.`, "error");
        return;
      }

      if (question.answers.filter(answer => answer.correct).length !== 1) {
        showNotice(this.shadowRoot, `La pregunta ${i + 1} debe tener exactamente una respuesta correcta.`, "error");
        return;
      }
    }

    const wasEditing = Boolean(this.editingId);

    const result = wasEditing
      ? examService.update(this.editingId, { ...data, questions: this.questions })
      : examService.create({ ...data, questions: this.questions });

    if (!result.success) {
      showNotice(this.shadowRoot, result.message, "error");
      return;
    }

    this.editingId = null;
    this.questions = [];
    this.render();

    showNotice(
      this.shadowRoot,
      wasEditing ? "Examen actualizado correctamente." : "Examen creado correctamente."
    );
  }

  handleDelete(id) {
    const exam = examService.getAll().find(item => item.id === id);

    if (!exam || !confirm(`¿Eliminar el examen "${exam.title}"?`)) return;

    const result = examService.remove(id);

    if (this.editingId === id) {
      this.editingId = null;
      this.questions = [];
    }

    this.render();

    showNotice(
      this.shadowRoot,
      result.success ? "Examen eliminado correctamente." : result.message,
      result.success ? "success" : "error"
    );
  }
}

customElements.define("user-management", UserManagement);
customElements.define("exam-management", ExamManagement);
