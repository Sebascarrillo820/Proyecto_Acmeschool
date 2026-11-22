
import { storage } from "./storage.js";

function generateId() {
  return `user-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export const userService = {
  getAll() {
    return storage.getUsers();
  },

  create(data) {
    const users = storage.getUsers();
    const email = data.email.trim().toLowerCase();
    const identification = data.identification.trim();

    if (users.some(user => user.email.toLowerCase() === email)) {
      return { success: false, message: "Este correo ya está registrado." };
    }

    if (users.some(user => user.identification === identification)) {
      return { success: false, message: "Esta identificación ya está registrada." };
    }

    const newUser = {
      id: generateId(),
      identification,
      fullName: data.fullName.trim(),
      email,
      phone: data.phone.trim(),
      role: data.role,
      password: data.password
    };

    users.push(newUser);
    storage.saveUsers(users);

    return { success: true, user: newUser };
  },

  update(id, data) {
    const users = storage.getUsers();
    const index = users.findIndex(user => user.id === id);

    if (index === -1) {
      return { success: false, message: "Usuario no encontrado." };
    }

    const email = data.email.trim().toLowerCase();
    const identification = data.identification.trim();

    if (users.some(user => user.id !== id && user.email.toLowerCase() === email)) {
      return { success: false, message: "Otro usuario ya utiliza ese correo." };
    }

    if (users.some(user => user.id !== id && user.identification === identification)) {
      return { success: false, message: "Otro usuario ya utiliza esa identificación." };
    }

    const previous = users[index];

    users[index] = {
      ...previous,
      identification,
      fullName: data.fullName.trim(),
      email,
      phone: data.phone.trim(),
      role: data.role,
      password: data.password || previous.password
    };

    storage.saveUsers(users);

    return { success: true, user: users[index] };
  },

  remove(id) {
    const users = storage.getUsers();

    if (!users.some(user => user.id === id)) {
      return { success: false, message: "Usuario no encontrado." };
    }

    storage.saveUsers(users.filter(user => user.id !== id));

    return { success: true };
  }
};
