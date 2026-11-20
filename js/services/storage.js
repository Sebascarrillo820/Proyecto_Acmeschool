import { INITIAL_DATA } from "../data/initial-data.js";

const STORAGE_KEYS = {
  users: "acme_users",
  exams: "acme_exams",
  results: "acme_results",
  session: "acme_session"
};

function readJSON(key, fallback) {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue === null ? fallback : JSON.parse(storedValue);
  } catch (error) {
    console.error(`No se pudo leer la clave ${key} de localStorage:`, error);
    return fallback;
  }
}

export const storage = {
  initialize() {
    // Solo se crean los datos iniciales cuando todavía no existen.
    if (localStorage.getItem(STORAGE_KEYS.users) === null) {
      localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(INITIAL_DATA.users));
    }
    if (localStorage.getItem(STORAGE_KEYS.exams) === null) {
      localStorage.setItem(STORAGE_KEYS.exams, JSON.stringify(INITIAL_DATA.exams));
    }
    if (localStorage.getItem(STORAGE_KEYS.results) === null) {
      localStorage.setItem(STORAGE_KEYS.results, JSON.stringify(INITIAL_DATA.results));
    }
  },

  getUsers() {
    return readJSON(STORAGE_KEYS.users, []);
  },
  saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  },
  getExams() {
    return readJSON(STORAGE_KEYS.exams, []);
  },
  saveExams(exams) {
    localStorage.setItem(STORAGE_KEYS.exams, JSON.stringify(exams));
  },
  getResults() {
    return readJSON(STORAGE_KEYS.results, []);
  },
  saveResults(results) {
    localStorage.setItem(STORAGE_KEYS.results, JSON.stringify(results));
  },
  getSession() {
    return readJSON(STORAGE_KEYS.session, null);
  },
  saveSession(session) {
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
  },
  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.session);
  }
};
