// Datos de demostración para iniciar la aplicación por primera vez.
// En el Día 2 ampliaremos esta estructura con el CRUD administrativo.
export const INITIAL_DATA = {
  users: [
    {
      id: "user-admin-001",
      identification: "1000000001",
      fullName: "Administrador Acme",
      email: "admin@acmeschool.com",
      phone: "3000000001",
      role: "Administrativo",
      password: "Admin123!"
    },
    {
      id: "user-teacher-001",
      identification: "1000000002",
      fullName: "Docente de Prueba",
      email: "docente@acmeschool.com",
      phone: "3000000002",
      role: "Docente",
      password: "Docente123!"
    }
  ],
  exams: [],
  results: []
};
