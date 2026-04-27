import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

/* ========================= */
const generateToken = (user) =>
    jwt.sign(
        {
            userId: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

const generateRefreshToken = (user) =>
    jwt.sign(
        {
            userId: user._id,
            role: user.role,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );

/* =========================
   COOKIE CONFIG (PRO FIX)
========================= */
const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
};

/* =========================
   REGISTER FIX
========================= */
export const register = async (req, res, next) => {
    try {
        const { displayName, email, password } = req.body;

        if (!displayName || !email || !password) {
            return res.status(400).json({
                message: "Missing fields",
            });
        }

        const exists = await User.findOne({ email });

        if (exists) {
            return res
                .status(400)
                .json({ message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            displayName,
            email,
            hashPassword,
            role: "guest",
        });

        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie("token", token, {
            ...cookieOptions,
            maxAge: 3600000,
        });

        res.cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 3600000,
            path: "/api/auth/refresh",
        });

        res.status(201).json({
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
   LOGIN FIX
========================= */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const match = await bcrypt.compare(
            password,
            user.hashPassword
        );

        if (!match) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie("token", token, {
            ...cookieOptions,
            maxAge: 3600000,
        });

        res.cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 3600000,
            path: "/api/auth/refresh",
        });

        res.json({
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