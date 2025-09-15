import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import playerRoutes from "./routes/players.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:8081', 'exp://localhost:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/players", playerRoutes);

// Simple route
app.get("/", (req, res) => {
  res.send("PlayConnect API is running ✅");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
