const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;

// ─────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "AI Resume Analyzer API is running",
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// ─────────────────────────────────────────────
// Global Error Handler
// ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ success: false, message: "File size too large. Max 5MB." });
  }

  // Multer file type error
  if (err.message === "Only PDF files are allowed") {
    return res.status(400).json({ success: false, message: err.message });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ─────────────────────────────────────────────
// Connect to MongoDB and Start Server
// ─────────────────────────────────────────────
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(` MongoDB connected: ${mongoose.connection.name}`);
  } catch (error) {
    console.error(" MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(` Client URL: ${process.env.CLIENT_URL}`);

    // ── Keep-alive ping (Render free tier spins down after 15min inactivity) ──
    if (process.env.NODE_ENV !== "development") {
      const SELF_URL = process.env.RENDER_EXTERNAL_URL || process.env.CLIENT_URL?.replace("vercel.app", "onrender.com");
      if (SELF_URL) {
        setInterval(async () => {
          try {
            await fetch(`https://ai-resume-analyser-lkoe.onrender.com/api/health`);
            console.log("🏓 Keep-alive ping sent");
          } catch (e) {
            console.warn("Keep-alive ping failed:", e.message);
          }
        }, 14 * 60 * 1000); // every 14 minutes
      }
    }
  });
});

module.exports = app;
