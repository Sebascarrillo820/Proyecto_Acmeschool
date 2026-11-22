
import { storage } from "../services/storage.js";

class ExamTaking extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.exam = null;
    this.student = null;
    this.startedAt = null;
    this.remainingSeconds = 0;
    this.timer = null;
    this.finished = false;
    this.selectedAnswers = {};
  }

  connectedCallback() {
    this.renderExamList();
  }

  disconnectedCallback() {
    this.stopTimer();
  }

  getStyles() {
    return `
      :host {
        display: block;
        min-height: 100vh;
        background: #f4f7fb;
        color: #17243b;
        font-family: 'DM Sans', Arial, sans-serif;
      }

      * { box-sizing: border-box; }

      .container {
        width: min(1050px, calc(100% - 32px));
        margin: 0 auto;
        padding: 38px 0 60px;
      }

      .topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        margin-bottom: 28px;
      }

      .brand {
        color: #183b70;
        font-size: 21px;
        font-weight: 800;
        letter-spacing: -0.5px;
      }

      .eyebrow {
        color: #3974bd;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 1.5px;
        text-transform: uppercase;
      }

      h1 {
        margin: 8px 0;
        color: #17243b;
        font-size: clamp(27px, 5vw, 38px);
        line-height: 1.15;
      }

      .subtitle {
        color: #68758a;
        line-height: 1.6;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 18px;
        margin-top: 28px;
      }

      .card {
        padding: 24px;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        background: #fff;
        box-shadow: 0 8px 24px rgba(25, 49, 84, .05);
      }

      .card h2 {
        margin: 0 0 10px;
        font-size: 19px;
      }

      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 17px 0;
      }

      .tag {
        padding: 7px 10px;
        border-radius: 20px;
        background: #edf4fc;
        color: #285b99;
        font-size: 12px;
        font-weight: 700;
      }

      button {
        border: 0;
        border-radius: 9px;
        padding: 12px 17px;
        background: #2563a9;
        color: white;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
        transition: background .2s, transform .2s;
      }

      button:hover {
        background: #194b85;
        transform: translateY(-1px);
      }

      button:disabled {
        cursor: not-allowed;
        opacity: .5;
        transform: none;
      }

      .secondary {
        border: 1px solid #d8e0eb;
        background: white;
        color: #34445d;
      }

      .secondary:hover {
        background: #f0f4f9;
        color: #17243b;
      }

      .form-card {
        max-width: 600px;
        margin: 28px auto;
      }

      label {
        display: block;
        margin: 17px 0 7px;
        color: #34445d;
        font-size: 14px;
        font-weight: 700;
      }

      input[type="text"] {
        width: 100%;
        padding: 13px 14px;
        border: 1px solid #d7dfeb;
        border-radius: 9px;
        outline: none;
        background: white;
        color: #17243b;
        font: inherit;
      }

      input:focus {
        border-color: #397bc2;
        box-shadow: 0 0 0 3px rgba(57, 123, 194, .12);
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 22px;
      }

      .notice {
        margin-top: 15px;
        padding: 12px 14px;
        border-radius: 9px;
        background: #fff4e5;
        color: #89520b;
        font-size: 14px;
      }

      .exam-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
        padding: 22px;
        border-radius: 15px;
        background: #183b70;
        color: white;
      }

      .exam-header h1 {
        color: white;
        font-size: 25px;
      }

      .exam-header p {
        margin: 6px 0 0;
        color: #dbe8f8;
      }

      .timer {
        min-width: 125px;
        padding: 12px 16px;
        border: 1px solid rgba(255,255,255,.25);
        border-radius: 12px;
        text-align: center;
        background: rgba(255,255,255,.1);
      }

      .timer small {
        display: block;
        margin-bottom: 4px;
        color: #dbe8f8;
      }

      .timer strong {
        font-size: 25px;
        font-variant-numeric: tabular-nums;
      }

      .timer.warning {
        background: #8c2e36;
      }

      .question {
        margin-top: 18px;
        padding: 22px;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        background: white;
      }

      .question h3 {
        margin: 0 0 17px;
        font-size: 17px;
        line-height: 1.5;
      }

      .option {
        display: flex;
        align-items: flex-start;
        gap: 11px;
        margin-top: 10px;
        padding: 13px;
        border: 1px solid #e1e7ef;
        border-radius: 9px;
        cursor: pointer;
        font-weight: 400;
        line-height: 1.45;
      }

      .option:has(input:checked) {
        border-color: #397bc2;
        background: #f0f6fd;
      }

      .option input {
        margin-top: 3px;
        accent-color: #2563a9;
      }

      .result {
        max-width: 650px;
        margin: 30px auto;
        padding: 32px;
        border: 1px solid #e2e8f0;
        border-radius: 18px;
        background: white;
        text-align: center;
        box-shadow: 0 8px 24px rgba(25, 49, 84, .05);
      }

      .result-score {
        margin: 22px 0;
        color: #2563a9;
        font-size: 54px;
        font-weight: 800;
      }

      .approved { color: #16834c; }
      .not-approved { color: #bd3945; }

      .empty {
        padding: 30px;
        border: 1px dashed #cbd5e1;
        border-radius: 14px;
        color: #68758a;
        text-align: center;
        background: white;
      }

      @media (max-width: 600px) {
        .container { padding-top: 22px; }
        .exam-header { align-items: flex-start; }
        .question { padding: 17px; }
        .result { padding: 24px 17px; }
      }
    `;
  }

  render(content) {
    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="container">
        ${content}
      </div>
    `;
  }

  renderTopbar() {
    return `
      <header class="topbar">
        <div class="brand">ACME SCHOOL</div>
        <button class="secondary" id="back-button" type="button">
          Volver
        </button>
      </header>
    `;
  }

  renderExamList() {
    this.stopTimer();
    this.exam = null;
    this.student = null;
    this.finished = false;

    const exams = storage.getExams();

    const availableExams = exams.filter(exam =>
      Array.isArray(exam.questions) && exam.questions.length > 0 &&
      exam.questions.every(question =>
        Array.isArray(question.answers) &&
        question.answers.length >= 2 &&
        question.answers.filter(answer => answer.correct).length === 1
      )
    );

    const cards = availableExams.map(exam => `
      <article class="card">
        <p class="eyebrow">${this.escapeHTML(exam.code || "EXAMEN")}</p>
        <h2>${this.escapeHTML(exam.title)}</h2>
        <p class="subtitle">
          ${this.escapeHTML(exam.description || "Evaluación académica de Acme School.")}
        </p>
        <div class="meta">
          <span class="tag">${exam.time} minutos</span>
          <span class="tag">${exam.questions.length} preguntas</span>
          <span class="tag">Aprobación: ${exam.passingPercentage}%</span>
        </div>
        <button type="button" data-exam-id="${this.escapeHTML(exam.id)}">
          Presentar examen
        </button>
      </article>
    `).join("");

    this.render(`
      ${this.renderTopbar()}
      <p class="eyebrow">MÓDULO PARA ESTUDIANTES</p>
      <h1>Exámenes disponibles</h1>
      <p class="subtitle">
        Selecciona una evaluación para comenzar. No necesitas iniciar sesión.
      </p>
      ${
        cards
          ? `<section class="grid">${cards}</section>`
          : `<div class="empty">
              <h2>No hay exámenes disponibles</h2>
              <p>Por el momento no hay evaluaciones configuradas para presentar.</p>
            </div>`
      }
    `);

    this.shadowRoot.querySelector("#back-button")
      .addEventListener("click", () => this.goBack());

    this.shadowRoot.querySelectorAll("[data-exam-id]").forEach(button => {
      button.addEventListener("click", () => {
        this.selectExam(button.dataset.examId);
      });
    });
  }

  selectExam(examId) {
    const exam = storage.getExams().find(item => item.id === examId);

    if (!exam) {
      this.renderExamList();
      return;
    }

    this.exam = exam;
    this.renderStudentForm();
  }

  renderStudentForm() {
    this.render(`
      ${this.renderTopbar()}
      <section class="card form-card">
        <p class="eyebrow">REGISTRO DEL ESTUDIANTE</p>
        <h1>${this.escapeHTML(this.exam.title)}</h1>
        <p class="subtitle">
          Antes de comenzar, ingresa tus datos. Estos quedarán asociados
          al resultado de tu evaluación.
        </p>

        <div class="meta">
          <span class="tag">${this.exam.time} minutos</span>
          <span class="tag">${this.exam.questions.length} preguntas</span>
          <span class="tag">Aprobación: ${this.exam.passingPercentage}%</span>
        </div>

        <form id="student-form">
          <label for="student-identification">Número de identificación</label>
          <input
            id="student-identification"
            name="identification"
            type="text"
            maxlength="30"
            required
            autocomplete="off"
            placeholder="Ej. 1234567890"
          >

          <label for="student-name">Nombre completo</label>
          <input
            id="student-name"
            name="fullName"
            type="text"
            maxlength="100"
            required
            autocomplete="name"
            placeholder="Escribe tu nombre completo"
          >

          <div class="notice">
            Al comenzar, el temporizador iniciará la cuenta regresiva.
            Asegúrate de tener tiempo suficiente para responder.
          </div>

          <div class="actions">
            <button type="submit">Comenzar examen</button>
            <button class="secondary" id="cancel-button" type="button">
              Cancelar
            </button>
          </div>
        </form>
      </section>
    `);

    this.shadowRoot.querySelector("#back-button")
      .addEventListener("click", () => this.renderExamList());

    this.shadowRoot.querySelector("#cancel-button")
      .addEventListener("click", () => this.renderExamList());

    this.shadowRoot.querySelector("#student-form")
      .addEventListener("submit", event => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const identification = String(formData.get("identification")).trim();
        const fullName = String(formData.get("fullName")).trim();

        if (!identification || !fullName) {
          return;
        }

        this.student = { identification, fullName };
        this.startExam();
      });
  }

  startExam() {
    this.selectedAnswers = {};
    this.finished = false;
    this.startedAt = new Date().toISOString();
    this.remainingSeconds = Math.max(1, Number(this.exam.time) || 1) * 60;

    this.renderQuestions();
    this.startTimer();
  }

  renderQuestions() {
    const questionsHTML = this.exam.questions.map((question, index) => {
      const answersHTML = question.answers.map(answer => `
        <label class="option">
          <input
            type="radio"
            name="question-${this.escapeHTML(question.id)}"
            value="${this.escapeHTML(answer.id)}"
            data-question-id="${this.escapeHTML(question.id)}"
          >
          <span>${this.escapeHTML(answer.text)}</span>
        </label>
      `).join("");

      return `
        <article class="question">
          <h3>${index + 1}. ${this.escapeHTML(question.text)}</h3>
          ${answersHTML}
        </article>
      `;
    }).join("");

    this.render(`
      <header class="exam-header">
        <div>
          <p class="eyebrow">ACME SCHOOL · EVALUACIÓN</p>
          <h1>${this.escapeHTML(this.exam.title)}</h1>
          <p>
            ${this.exam.questions.length} preguntas ·
            Aprobación: ${this.exam.passingPercentage}%
          </p>
          <p>Estudiante: ${this.escapeHTML(this.student.fullName)}</p>
        </div>
        <div class="timer" id="timer">
          <small>Tiempo restante</small>
          <strong id="timer-value">--:--</strong>
        </div>
      </header>

      <form id="exam-form">
        ${questionsHTML}
        <div class="actions">
          <button type="submit">Terminar examen</button>
        </div>
      </form>
    `);

    this.shadowRoot.querySelectorAll('input[type="radio"]').forEach(input => {
      input.addEventListener("change", () => {
        this.selectedAnswers[input.dataset.questionId] = input.value;
      });
    });

    this.shadowRoot.querySelector("#exam-form")
      .addEventListener("submit", event => {
        event.preventDefault();

        const unanswered = this.exam.questions.filter(question =>
          !this.selectedAnswers[question.id]
        ).length;

        const message = unanswered > 0
          ? `Te faltan ${unanswered} pregunta(s) por responder. ¿Deseas terminar de todas formas?`
          : "¿Estás seguro de que deseas terminar el examen?";

        if (window.confirm(message)) {
          this.finishExam("manual");
        }
      });

    this.updateTimerDisplay();
  }

  startTimer() {
    this.stopTimer();

    this.timer = window.setInterval(() => {
      if (this.finished) {
        this.stopTimer();
        return;
      }

      this.remainingSeconds -= 1;
      this.updateTimerDisplay();

      if (this.remainingSeconds <= 0) {
        this.remainingSeconds = 0;
        this.finishExam("timeout");
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  updateTimerDisplay() {
    const timerValue = this.shadowRoot.querySelector("#timer-value");
    const timerBox = this.shadowRoot.querySelector("#timer");

    if (!timerValue || !timerBox) return;

    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;

    timerValue.textContent =
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    timerBox.classList.toggle("warning", this.remainingSeconds <= 60);
  }

  finishExam(reason) {
    if (this.finished || !this.exam || !this.student) return;

    this.finished = true;
    this.stopTimer();

    const finishedAt = new Date().toISOString();

    let correctAnswers = 0;

    const answers = this.exam.questions.map(question => {
      const selectedId = this.selectedAnswers[question.id] || null;
      const selectedAnswer = question.answers.find(
        answer => answer.id === selectedId
      );
      const correctAnswer = question.answers.find(answer => answer.correct);
      const isCorrect = Boolean(
        selectedAnswer && correctAnswer &&
        selectedAnswer.id === correctAnswer.id
      );

      if (isCorrect) correctAnswers += 1;

      return {
        questionId: question.id,
        questionText: question.text,
        selectedAnswerId: selectedId,
        selectedAnswerText: selectedAnswer?.text || null,
        correctAnswerId: correctAnswer?.id || null,
        correctAnswerText: correctAnswer?.text || null,
        isCorrect
      };
    });

    const totalQuestions = this.exam.questions.length;
    const percentage = totalQuestions > 0
      ? Number(((correctAnswers / totalQuestions) * 100).toFixed(2))
      : 0;

    const passingPercentage = Number(this.exam.passingPercentage) || 0;
    const passed = percentage >= passingPercentage;

    const result = {
      id: `result-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      examId: this.exam.id,
      examCode: this.exam.code,
      examTitle: this.exam.title,
      studentIdentification: this.student.identification,
      studentName: this.student.fullName,
      answers,
      totalQuestions,
      correctAnswers,
      percentage,
      passingPercentage,
      passed,
      finishReason: reason,
      startedAt: this.startedAt,
      finishedAt
    };

    try {
      const results = storage.getResults();
      results.push(result);
      storage.saveResults(results);
    } catch (error) {
      console.error("No se pudo guardar el resultado:", error);
    }

    this.renderResult(result);
  }

  renderResult(result) {
    const statusClass = result.passed ? "approved" : "not-approved";
    const statusText = result.passed ? "¡Examen aprobado!" : "Examen no aprobado";
    const reasonText = result.finishReason === "timeout"
      ? "El tiempo del examen llegó a cero."
      : "Finalizaste el examen antes de que terminara el tiempo.";

    this.render(`
      <section class="result">
        <p class="eyebrow">RESULTADO DE LA EVALUACIÓN</p>
        <h1>${this.escapeHTML(result.studentName)}</h1>
        <p class="subtitle">
          Identificación: ${this.escapeHTML(result.studentIdentification)}
        </p>

        <div class="result-score">${result.percentage}%</div>

        <h2 class="${statusClass}">${statusText}</h2>

        <p class="subtitle">
          Respuestas correctas: ${result.correctAnswers} de ${result.totalQuestions}
        </p>
        <p class="subtitle">
          Porcentaje mínimo para aprobar: ${result.passingPercentage}%
        </p>
        <p class="subtitle">${reasonText}</p>

        <div class="actions" style="justify-content:center">
          <button id="return-button" type="button">
            Volver a exámenes
          </button>
        </div>
      </section>
    `);

    this.shadowRoot.querySelector("#return-button")
      .addEventListener("click", () => this.renderExamList());
  }

  goBack() {
    this.dispatchEvent(new CustomEvent("back-to-login", {
      bubbles: true,
      composed: true
    }));
  }

  escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }
}

customElements.define("exam-taking", ExamTaking);
