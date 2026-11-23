
import { storage } from "../services/storage.js";

class ResultsManagement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  get results() {
    return storage.getResults() || [];
  }

  formatDate(date) {
    if (!date) return "No disponible";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "No disponible";
    }

    return parsedDate.toLocaleString("es-CO", {
      dateStyle: "short",
      timeStyle: "short"
    });
  }

  escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[character]);
  }

  render() {
    const results = this.results;

    const approved = results.filter(result => result.passed).length;
    const failed = results.length - approved;

    const average = results.length
      ? results.reduce((sum, result) => sum + Number(result.percentage || 0), 0) / results.length
      : 0;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          color: #1e293b;
          font-family: Arial, sans-serif;
        }

        .header {
          margin-bottom: 24px;
        }

        h2 {
          margin: 0 0 8px;
          font-size: 25px;
        }

        .subtitle {
          color: #64748b;
          margin: 0;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 18px;
        }

        .stat span {
          display: block;
          color: #64748b;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .stat strong {
          font-size: 25px;
        }

        .table-container {
          overflow-x: auto;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 720px;
        }

        th, td {
          padding: 14px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
          font-size: 13px;
        }

        th {
          background: #f8fafc;
          color: #475569;
        }

        .status {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 12px;
        }

        .passed {
          color: #166534;
          background: #dcfce7;
        }

        .failed {
          color: #991b1b;
          background: #fee2e2;
        }

        .empty {
          text-align: center;
          padding: 35px;
          color: #64748b;
        }

        .refresh {
          margin-top: 18px;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          background: #2563eb;
          color: white;
          font-weight: bold;
          cursor: pointer;
        }

        .refresh:hover {
          background: #1d4ed8;
        }

        @media (max-width: 650px) {
          .stats {
            grid-template-columns: 1fr;
          }
        }
      </style>

      <section>
        <header class="header">
          <h2>Resultados de exámenes</h2>
          <p class="subtitle">
            Consulta las calificaciones y el estado de los estudiantes.
          </p>
        </header>

        <div class="stats">
          <article class="stat">
            <span>Exámenes presentados</span>
            <strong>${results.length}</strong>
          </article>

          <article class="stat">
            <span>Exámenes aprobados</span>
            <strong>${approved}</strong>
          </article>

          <article class="stat">
            <span>Promedio general</span>
            <strong>${average.toFixed(1)}%</strong>
          </article>
        </div>

        <div class="table-container">
          ${
            results.length
              ? `
                <table>
                  <thead>
                    <tr>
                      <th>Estudiante</th>
                      <th>Identificación</th>
                      <th>Examen</th>
                      <th>Calificación</th>
                      <th>Respuestas</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${results.map(result => `
                      <tr>
                        <td>${this.escapeHTML(result.studentName)}</td>
                        <td>${this.escapeHTML(result.studentIdentification)}</td>
                        <td>${this.escapeHTML(result.examTitle)}</td>
                        <td>${Number(result.percentage || 0).toFixed(1)}%</td>
                        <td>
                          ${Number(result.correctAnswers || 0)}
                          / ${Number(result.totalQuestions || 0)}
                        </td>
                        <td>
                          <span class="status ${result.passed ? "passed" : "failed"}">
                            ${result.passed ? "Aprobado" : "No aprobado"}
                          </span>
                        </td>
                        <td>${this.formatDate(result.finishedAt)}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              `
              : `
                <div class="empty">
                  <h3>Aún no hay resultados</h3>
                  <p>Cuando un estudiante termine un examen, su resultado aparecerá aquí.</p>
                </div>
              `
          }
        </div>

        <button class="refresh" type="button">
          Actualizar resultados
        </button>
      </section>
    `;

    this.shadowRoot.querySelector(".refresh").addEventListener("click", () => {
      this.render();
    });
  }
}

customElements.define("results-management", ResultsManagement);
