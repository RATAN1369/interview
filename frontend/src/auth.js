// src/auth.js

// safely read user from localStorage
function readUserSafe() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export const authStore = {
  user: readUserSafe(),

  setUser(u) {
    this.user = u;
    if (u) {
      localStorage.setItem("user", JSON.stringify(u));
    } else {
      localStorage.removeItem("user");
    }
  },

  setToken(token) {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  },

  getToken() {
    return localStorage.getItem("token");
  },

  clear() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.user = null;
  },

  logout() {
    this.clear();
    window.location.href = "/"; // redirect to login on logout
  },
};
