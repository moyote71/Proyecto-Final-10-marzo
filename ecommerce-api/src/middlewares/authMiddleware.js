import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const cookieToken = req.cookies?.token;
  const headerToken = req.headers.authorization?.split(" ")[1];

  const token = cookieToken || headerToken;

  console.log("=== AUTH MIDDLEWARE ===");
  console.log("Path:", req.path);
  console.log("Cookie token:", !!cookieToken);
  console.log("Header token:", !!headerToken);

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;