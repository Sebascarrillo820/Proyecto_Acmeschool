import { storage } from "./storage.js";

export const authService = {
  login(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = storage.getUsers().find((item) =>
      item.email.toLowerCase() === normalizedEmail && item.password === password
    );

    if (!user) {
      return { success: false, message: "El correo o la contraseña son incorrectos." };
    }

    // No guardamos la contraseña dentro de la sesión.
    const session = {
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      loggedAt: new Date().toISOString()
    };

    storage.saveSession(session);
    return { success: true, user: session };
  },

  getCurrentUser() {
    const session = storage.getSession();
    if (!session) return null;

    const userStillExists = storage.getUsers().some((user) => user.id === session.userId);
    if (!userStillExists) {
      storage.clearSession();
      return null;
    }

    return session;
  },

  logout() {
    storage.clearSession();
  }
};
