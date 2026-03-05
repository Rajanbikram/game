import User from "../../Model/auth/User.js";
import { hashPassword, comparePassword } from "../../security/hashHelper.js";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    console.log("📥 Register request:", { firstName, email, role });

    if (!firstName || !email || !password) {
      console.log("❌ Missing fields");
      return res.status(400).json({ message: "First name, email and password are required." });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      console.log("❌ Email already exists:", email);
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashed = await hashPassword(password);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashed,
      role: role || "user",
    });

    console.log("✅ User registered:", user.email);

    return res.status(201).json({
      message: "Registered successfully!",
      user: {
        id: user.id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Register error:", error.message);
    console.error("📍 Stack:", error.stack);
    return res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    console.log("📥 Login request:", { email, role });

    if (!email || !password) {
      console.log("❌ Missing fields");
      return res.status(400).json({ message: "Email and password are required." });
    }

    if (!role) {
      console.log("❌ Role missing");
      return res.status(400).json({ message: "Role is required." });
    }

    const user = await User.findOne({ where: { email, role } });
    if (!user) {
      console.log("❌ User not found:", email, role);
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch for:", email);
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is not defined in .env");
      return res.status(500).json({ message: "Server configuration error." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful:", user.email);

    return res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    console.error("📍 Stack:", error.stack);
    return res.status(500).json({
      message: "Server error.",
      error: error.message,
    });
  }
};