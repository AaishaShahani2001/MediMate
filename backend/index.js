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

import jwt from "jsonwebtoken";
import Appointment from "./models/Appointment.js";
import DoctorApplication from "./models/DoctorApplication.js";


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

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});


/* SOCKET.IO */

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  /* ================= ONLINE USERS (existing feature) ================= */
  socket.on("join", ({ userId }) => {
    onlineUsers.set(userId, socket.id);
    io.emit("online-users", Array.from(onlineUsers.keys()));
  });

  /* ================= APPOINTMENT VIDEO CALL ================= */

  socket.on("join-appointment", async ({ appointmentId }) => {
    try {
      const { id: userId, role } = socket.user;

      const appt = await Appointment.findById(appointmentId).lean();
      if (!appt) {
        socket.emit("join-denied", { message: "Appointment not found" });
        return;
      }

      if (!appt || appt.status !== "Confirmed") {
        return socket.emit("join-denied", {
          message: "Appointment not confirmed",
        });
      }

      if (appt.status === "Cancelled") {
        socket.emit("join-denied", { message: "Appointment cancelled" });
        return;
      }

      // Patient validation
      if (role === "patient") {
        if (String(appt.patientId) !== String(userId)) {
          socket.emit("join-denied", { message: "Not your appointment" });
          return;
        }
      }

      // Doctor validation
      if (role === "doctor") {
        const doc = await DoctorApplication.findOne({ userId }).lean();
        if (!doc || String(doc._id) !== String(appt.doctorApplicationId)) {
          socket.emit("join-denied", { message: "Not your appointment" });
          return;
        }
      }

      const now = new Date();
      const apptTime = new Date(`${appt.date}T${appt.time}`);
      const joinFrom = new Date(apptTime.getTime() - 5 * 60 * 1000);

      if (now < joinFrom) {
        return socket.emit("join-denied", {
          message: "You can join 5 minutes before the appointment time",
        });
      }

      const roomId = `appointment:${appointmentId}`;
      socket.join(roomId);

      socket.emit("join-ok", { roomId });

      const roomSize = io.sockets.adapter.rooms.get(roomId)?.size || 1;
      io.to(roomId).emit("room-users", { count: roomSize });

      if (roomSize >= 2) {
        io.to(roomId).emit("room-ready");
      }

      console.log(`✅ ${role} joined ${roomId}`);
    } catch (err) {
      socket.emit("join-denied", { message: "Join failed" });
    }
  });

  /* ================= WEBRTC SIGNALING ================= */

  socket.on("signal", ({ appointmentId, data }) => {
    const roomId = `appointment:${appointmentId}`;
    socket.to(roomId).emit("signal", data);
  });

  socket.on("leave-appointment", ({ appointmentId }) => {
    const roomId = `appointment:${appointmentId}`;
    socket.leave(roomId);
    socket.to(roomId).emit("peer-left");
  });

  /* ================= DISCONNECT ================= */

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit("online-users", Array.from(onlineUsers.keys()));
    console.log("❌ Socket disconnected:", socket.id);
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
