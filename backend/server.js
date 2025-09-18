import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import companyRoutes from "./routes/companies.js";
import cors from "cors";
import connectDB from "./config/db.js";
dotenv.config();
const app = express();

app.use(express.json());

// ✅ CORS setup
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Root health-check route (fix for "Cannot GET /")
app.get("/", (req, res) => {
  res.json({
    status: "✅ Backend is running",
    port: process.env.PORT || 5000,
    time: new Date().toISOString(),
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);

// Connect DB & Start Server
const PORT = process.env.PORT || 5000;


  connectDB().then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // agar DB connect nahi hua toh app band kar do
  });
