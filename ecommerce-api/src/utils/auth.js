import { http } from "../services/http";

/* =========================
   LOGIN
========================= */
export const login = async (email, password) => {
  try {
    const res = await http.post(
      "/auth/login",
      { email, password },
      {
        withCredentials: true, // 🔥 ESTE ES EL FIX REAL
      }
    );

    return {
      success: true,
      data: res.data,
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Error al iniciar sesión",
    };
  }
};

/* =========================
   REGISTER
========================= */
export const register = async (displayName, email, password) => {
  try {
    const res = await http.post(
      "/auth/register",
      { displayName, email, password },
      {
        withCredentials: true, // 🔥 TAMBIÉN AQUÍ
      }
    );

    return {
      success: true,
      data: res.data,
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Error al registrar",
    };
  }
};