import express from "express";
import Appointment from "../models/Appointment.js";
import DoctorApplication from "../models/DoctorApplication.js";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = express.Router();

/**
 * GET /api/admin/stats
 * Admin dashboard statistics
 */
router.get("/stats", auth, adminOnly, async (req, res) => {
  try {
    const totalDoctors = await DoctorApplication.countDocuments({
      status: "Approved", 
    });

    const totalUsers = await User.countDocuments({ role: "patient" });

    const totalAppointments = await Appointment.countDocuments();

    //console.log({ totalDoctors, totalUsers, totalAppointments });

    res.json({
      totalDoctors,
      totalUsers,
      totalAppointments,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ message: "Failed to load admin stats" });
  }
});

export default router;
