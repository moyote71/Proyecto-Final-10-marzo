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
   COOKIE CONFIG
========================= */
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
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

    res.status(201).json({
      message: "User created",
      user: {
        displayName: user.displayName,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   LOGIN
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
    const refreshToken = generateRefreshToken(user);

    res.cookie("token", token, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth/refresh",
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
   REFRESH TOKEN
========================= */
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    const newToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.cookie("token", newToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth/refresh",
    });

    res.json({
      message: "Token refreshed",
      user: {
        _id: user._id,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

/* =========================
   LOGOUT
========================= */
export const logout = async (req, res) => {
  res.clearCookie("token", cookieOptions);

  res.clearCookie("refreshToken", {
    ...cookieOptions,
    path: "/api/auth/refresh",
  });

  res.json({ message: "Logged out" });
};

/* =========================
   CHECK EMAIL (🔥 FIX CLAVE)
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