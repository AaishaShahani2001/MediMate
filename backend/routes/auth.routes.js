import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

const router = express.Router();

/**
 * POST /api/auth/signup
 * Body: { name, email, password, gender, phone, blood }
 * Creates a PATIENT by default
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, gender, phone, blood } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "name, email, password are required" });

    const exist = await User.findOne({ email });
    if (exist) return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: "patient", // default
      gender: gender || "Male",
      phone: phone || "",
      blood: blood || "O+",
    });

    const token = generateToken(user, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, role: user.role, email: user.email }
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns token for patient or doctor
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    // allow patient & doctor here
    if (!["patient", "doctor"].includes(user.role))
      return res.status(403).json({ message: "Use the admin login" });

    const token = generateToken(user, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
    res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role, email: user.email }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/admin/login
 * Body: { email, password }
 * Only for role === "admin"
 */
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "email and password are required" });

    const user = await User.findOne({ email, role: "admin" });
    if (!user) return res.status(401).json({ message: "Invalid admin credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid admin credentials" });

    const token = generateToken(user, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
    res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role, email: user.email }
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
