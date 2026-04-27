import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

/* =========================
   TOKENS
========================= */
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      displayName: user.displayName,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      displayName: user.displayName,
      role: user.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

/* =========================
   COOKIE CONFIG (🔥 FIX REAL)
========================= */
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
};

/* =========================
   REGISTER
========================= */
export const register = async (req, res, next) => {
  try {
    const { displayName, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      displayName,
      email,
      hashPassword,
      role: "guest",
    });

    // 🔥 OPCIONAL PERO RECOMENDADO: auto login después de registro
    const token = generateToken(user);

    res.cookie("token", token, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User created",
      user: {
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   LOGIN (🔥 FIX CLAVE)
========================= */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.hashPassword);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    // 🔥 IMPORTANTE: SOLO TOKEN (simplificamos)
    res.cookie("token", token, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   LOGOUT
========================= */
export const logout = async (req, res) => {
  res.clearCookie("token", {
    ...cookieOptions,
  });

  res.json({ message: "Logged out" });
};

/* =========================
   CHECK EMAIL
========================= */
export const checkEmail = async (req, res, next) => {
  try {
    const email = String(req.query.email || "").toLowerCase();
    const user = await User.findOne({ email });
    res.json({ taken: !!user });
  } catch (err) {
    next(err);
  }
};