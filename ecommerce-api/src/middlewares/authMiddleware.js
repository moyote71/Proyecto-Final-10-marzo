import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    let token = null;

    // =========================
    // 1. COOKIE (principal)
    // =========================
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // =========================
    // 2. HEADER fallback
    // =========================
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");

      if (parts[0] === "Bearer" && parts[1]) {
        token = parts[1];
      }
    }

    // =========================
    // 3. NO TOKEN
    // =========================
    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // =========================
    // 4. VERIFY TOKEN
    // =========================
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.userId) {
      return res.status(401).json({ message: "Token inválido" });
    }

    req.user = decoded;

    // =========================
    // 5. NORMALIZAR USER (🔥 FIX CLAVE)
    // =========================
    req.user = {
      id: decoded.userId || decoded.id,
      userId: decoded.userId || decoded.id,
      role: decoded.role || "customer",
    };

    next();
  } catch (err) {
    console.error("🔥 AUTH ERROR:", err.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;