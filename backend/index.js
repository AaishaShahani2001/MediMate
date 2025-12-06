import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";


const allowedOrigins = ["http://localhost:5173"];

//Initializing express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: allowedOrigins, credentials: true }));

// routes
app.use("/api/auth", authRoutes);

// health
app.get("/health", (_req, res) => res.json({ ok: true }));

// Connect MongoDB (with error handling)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => {
      console.log("❌ MongoDB connection error:", err);
      console.log("⚠️ Continuing without MongoDB for testing...");
    });
} else {
  console.log("⚠️ MONGODB_URI not set, continuing without database...");
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
