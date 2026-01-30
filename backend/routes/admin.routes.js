import express from "express";
import Appointment from "../models/Appointment.js";
import DoctorApplication from "../models/DoctorApplication.js";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = express.Router();

//========== ADMIN -  STATS CARD =============//
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


//=========== ADMIN - TODAY APPOINTMENTS ==============//
router.get("/appointments/today", auth, adminOnly, async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const count = await Appointment.countDocuments({
      date: { $gte: start, $lte: end },
      status: { $ne: "Cancelled" },
    });

    res.json({ todayAppointments: count });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch today appointments" });
  }

});


//============ ADMIN - TODAY APPOINTMENTS ==============//
router.get("/appointments/chart", auth, adminOnly, async (req, res) => {
  try {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      return d;
    });

    const stats = await Promise.all(
      last7Days.map(async (day) => {
        const next = new Date(day);
        next.setHours(23, 59, 59, 999);

        const count = await Appointment.countDocuments({
          date: { $gte: day, $lte: next },
          status: { $ne: "Cancelled" },
        });

        return {
          date: day.toISOString().slice(0, 10),
          count,
        };
      })
    );

    res.json(stats.reverse());
  } catch (err) {
    res.status(500).json({ message: "Failed to load appointment stats" });
  }



});
export default router;
