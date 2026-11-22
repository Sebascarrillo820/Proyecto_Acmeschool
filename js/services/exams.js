
import { storage } from "./storage.js";

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function prepareQuestions(questions) {
  return questions.map(question => ({
    id: question.id || generateId("question"),
    text: question.text.trim(),
    answers: question.answers.map(answer => ({
      id: answer.id || generateId("answer"),
      text: answer.text.trim(),
      correct: Boolean(answer.correct)
    }))
  }));
}

export const examService = {
  getAll() {
    return storage.getExams();
  },

  create(data) {
    const exams = storage.getExams();
    const code = data.code.trim().toUpperCase();

    if (exams.some(exam => exam.code.toUpperCase() === code)) {
      return { success: false, message: "Este código ya está registrado." };
    }

    const newExam = {
      id: generateId("exam"),
      code,
      title: data.title.trim(),
      time: Number(data.time),
      passingPercentage: Number(data.passingPercentage),
      description: data.description.trim(),
      questions: prepareQuestions(data.questions),
      createdAt: new Date().toISOString()
    };

    exams.push(newExam);
    storage.saveExams(exams);

    return { success: true, exam: newExam };
  },

  update(id, data) {
    const exams = storage.getExams();
    const index = exams.findIndex(exam => exam.id === id);

    if (index === -1) {
      return { success: false, message: "Examen no encontrado." };
    }

    const code = data.code.trim().toUpperCase();

    if (exams.some(exam => exam.id !== id && exam.code.toUpperCase() === code)) {
      return { success: false, message: "Otro examen ya utiliza ese código." };
    }

    exams[index] = {
      ...exams[index],
      code,
      title: data.title.trim(),
      time: Number(data.time),
      passingPercentage: Number(data.passingPercentage),
      description: data.description.trim(),
      questions: prepareQuestions(data.questions),
      updatedAt: new Date().toISOString()
    };

    storage.saveExams(exams);

    return { success: true, exam: exams[index] };
  },

  remove(id) {
    const exams = storage.getExams();

    if (!exams.some(exam => exam.id === id)) {
      return { success: false, message: "Examen no encontrado." };
    }

    storage.saveExams(exams.filter(exam => exam.id !== id));

    return { success: true };
  }
};
