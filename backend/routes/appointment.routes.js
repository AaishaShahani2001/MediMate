import express from "express";
import Appointment from "../models/Appointment.js";
import DoctorApplication from "../models/DoctorApplication.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/* ================= CREATE APPOINTMENT (PATIENT) ================= */
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Only patients can book appointments" });
    }

    const { doctorId, date, time, notes } = req.body;

    const doctor = await DoctorApplication.findOne({
      _id: doctorId,
      status: "Approved",
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // prevent duplicate slot booking
    const existing = await Appointment.findOne({
      doctorApplicationId: doctorId,
      date,
      time,
      status: { $ne: "Cancelled" },
    });

    if (existing) {
      return res.status(400).json({ message: "Time slot already booked" });
    }

    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorApplicationId: doctorId,
      date,
      time,
      notes,
    });

    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to book appointment" });
  }
});

/* ================= PATIENT: MY APPOINTMENTS ================= */
router.get("/my", auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.user.id,
    })
      .populate("doctorApplicationId", "fullName specialization")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Failed to load appointments" });
  }
});


/* ================= DOCTOR: MY APPOINTMENTS ================= */
router.get("/doctor", auth, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const doctorApp = await DoctorApplication.findOne({
      userId: req.user.id,
      status: "Approved",
    });

    if (!doctorApp) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const appointments = await Appointment.find({
      doctorApplicationId: doctorApp._id,
    })
      .populate("patientId", "name email")
      .sort({ date: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Failed to load doctor appointments" });
  }
});

/* ================= CANCEL APPOINTMENT ================= */
router.patch("/:id/cancel", auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // patient or doctor can cancel
    if (
      appointment.patientId.toString() !== req.user.id &&
      req.user.role !== "doctor"
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    appointment.status = "Cancelled";
    await appointment.save();

    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel appointment" });
  }
});

// Edit appointment (Patient)
router.patch("/:id/edit", auth, async (req, res) => {
  const { date, time } = req.body;

  try {
    const appt = await Appointment.findById(req.params.id);

    if (!appt) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appt.patientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (appt.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Only pending appointments can be edited" });
    }

    appt.date = date;
    appt.time = time;
    await appt.save();

    res.json({ message: "Appointment updated", appointment: appt });
  } catch (err) {
    res.status(500).json({ message: "Failed to update appointment" });
  }
});


// Cancel appointment (Patient)
router.patch("/:id/cancel", auth, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);

    if (!appt) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Only owner can cancel
    if (appt.patientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Only pending appointments
    if (appt.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Only pending appointments can be cancelled" });
    }

    appt.status = "Cancelled";
    await appt.save();

    res.json({ message: "Appointment cancelled", appointment: appt });
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel appointment" });
  }
});


export default router;
