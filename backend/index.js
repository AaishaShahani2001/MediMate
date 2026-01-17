import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import doctorApplicationRoutes from "./routes/doctorApplication.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import reportRoutes from "./routes/reportRoutes.js";
import adminRoutes from "./routes/admin.routes.js"
import aiRoutes from "./routes/ai.routes.js";
import messageRoutes from "./routes/message.route.js";

const allowedOrigins = ["http://localhost:5173"];

//Initializing express app
const app = express();


// app.use(cors({
//   origin: "http://localhost:5176", // frontend URL
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctor-applications", doctorApplicationRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/messages", messageRoutes);

// health
app.get("/health", (_req, res) => res.json({ ok: true }));

const server = http.createServer(app);

/* SOCKET.IO */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  }
});

io.on("connection", (socket) => {
  socket.on("join", ({ userId }) => {
    onlineUsers.set(userId, socket.id);
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });
});



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
