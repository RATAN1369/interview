import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { sendOtpEmail } from "../utils/mailer.js";

const router = express.Router();

/* ---------- STEP 1: Request OTP ---------- */
router.post("/signup/request-otp", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expireAt = new Date(Date.now() + process.env.OTP_EXPIRE_MIN * 60 * 1000);

    await Otp.create({ email, otp: otpCode, expireAt, data: { name, password: hashedPassword } });

    await sendOtpEmail(email, otpCode);

    res.json({ msg: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------- STEP 2: Verify OTP ---------- */
router.post("/signup/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpDoc = await Otp.findOne({ email, otp });
    if (!otpDoc) return res.status(400).json({ msg: "Invalid OTP" });
    if (otpDoc.expireAt < new Date()) {
      await Otp.deleteMany({ email });
      return res.status(400).json({ msg: "OTP expired" });
    }

    const { name, password } = otpDoc.data;
    const role = email === process.env.ADMIN_EMAIL ? "admin" : "user";

    const user = new User({ name, email, password, role });
    await user.save();

    await Otp.deleteMany({ email });

    res.json({ msg: "Signup successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------- LOGIN ---------- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      redirect: user.role === "admin" ? "/admin/dashboard" : "/user/dashboard",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------- STEP 1: Forgot password - request OTP ---------- */
router.post("/forgot/request-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "No account with this email" });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expireAt = new Date(Date.now() + process.env.OTP_EXPIRE_MIN * 60 * 1000);

    await Otp.create({ email, otp: otpCode, expireAt, data: { reset: true } });
    await sendOtpEmail(email, otpCode);

    res.json({ msg: "OTP sent to email for password reset" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------- STEP 2: Forgot password - verify OTP + reset ---------- */
router.post("/forgot/reset", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const otpDoc = await Otp.findOne({ email, otp });
    if (!otpDoc) return res.status(400).json({ msg: "Invalid OTP" });
    if (otpDoc.expireAt < Date.now()) return res.status(400).json({ msg: "OTP expired" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    await User.updateOne({ email }, { password: hashed });

    await Otp.deleteMany({ email });

    res.json({ msg: "Password reset successful. Please login." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
