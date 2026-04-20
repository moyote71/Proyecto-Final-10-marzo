import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const generateToken = (userId, displayName, role) => {
  return jwt.sign({ userId, displayName, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const generateRefreshToken = (userId, displayName, role) => {
  return jwt.sign(
    { userId, displayName, role },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

const generatePassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const checkUserExist = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

async function register(req, res, next) {
  try {
    const { displayName, email, password } = req.body;
    const userExist = await checkUserExist(email);
    if (userExist) {
      return res.status(400).json({ message: "User already exist" });
    }
    let role = "guest";
    const hashPassword = await generatePassword(password);
    const newUser = new User({
      displayName,
      email,
      hashPassword,
      role,
    });
    await newUser.save();
    res.status(201).json({ displayName, email });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const userExist = await checkUserExist(email);
    if (!userExist) {
      return res
        .status(400)
        .json({ message: "User does not exist. You must to sign in" });
    }
    const isMatch = await bcrypt.compare(password, userExist.hashPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = generateToken(
      userExist._id,
      userExist.displayName,
      userExist.role,
    );
    const refreshToken = generateRefreshToken(
      userExist._id,
      userExist.displayName,
      userExist.role,
    );
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res.cookie("token", token, { ...cookieOptions, maxAge: 3600 * 1000 });
    res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 3600 * 1000, path: "/api/auth/refresh" });

    res.status(200).json({
      user: {
        _id: userExist._id,
        displayName: userExist.displayName,
        email: userExist.email,
        role: userExist.role,
      }
    });
  } catch (error) {
    next(error);
  }
}

async function checkEmail(req, res, next) {
  try {
    const email = String(req.query.email || "")
      .trim()
      .toLowerCase();

    const user = await User.findOne({ email });
    res.json({ taken: !!user });
  } catch (err) {
    next(err);
  }
}

async function refreshToken(req, res, next) {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token)
      return res.status(401).json({ message: "No refresh token provided" });

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err)
        return res.status(403).json({ message: "Invalid refresh token" });

      const newAccessToken = generateToken(
        decoded.userId,
        decoded.displayName,
        decoded.role,
      );

      // OPCIONAL
      const newRefreshToken = generateRefreshToken(
        decoded.userId,
        decoded.displayName,
        decoded.role,
      );

      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      };
      
      res.cookie("token", newAccessToken, { ...cookieOptions, maxAge: 3600 * 1000 });
      res.cookie("refreshToken", newRefreshToken, { ...cookieOptions, maxAge: 7 * 24 * 3600 * 1000, path: "/api/auth/refresh" });

      res.status(200).json({ message: "Token refreshed successfully" });
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    res.clearCookie("token");
    res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
}

export { checkEmail, login, register, refreshToken, logout };
