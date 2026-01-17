import express from "express";
import Appointment from "../models/Appointment.js";
import DoctorApplication from "../models/DoctorApplication.js";
import { auth } from "../middleware/auth.js";
import { doctorOnly } from "../middleware/doctorOnly.js";

const router = express.Router();

/* ================= CREATE APPOINTMENT (PATIENT) ================= */
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Only patients can book appointments" });
    }

    const { doctorId, date, time, notes } = req.body;

    // Check doctor exists & approved
    const doctor = await DoctorApplication.findOne({
      _id: doctorId,
      status: "Approved",
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    ///  AUTO-BLOCK LOGIC
    // appointment.routes.js

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const alreadyBooked = await Appointment.findOne({
      doctorApplicationId: doctorId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      time: time, // string compare is SAFE
      status: { $ne: "Cancelled" },
    });


    if (alreadyBooked) {
      return res.status(400).json({
        message: "This time slot is already booked",
      });
    }

    // Create appointment
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
router.get("/doctor/my", auth, doctorOnly, async (req, res) => {
  const doctor = await DoctorApplication.findOne({
    userId: req.user.id,
    status: "Approved",
  });

  if (!doctor) {
    return res.status(404).json({ message: "Doctor profile not found" });
  }

  const appts = await Appointment.find({
    doctorApplicationId: doctor._id,
  })
    .populate("patientId", "name email phone dob blood")
    .sort({ date: 1 });

  res.json(appts);
});

/* ================= DOCTOR: UPDATE STATUS ================= */
router.patch("/:id/status", auth, doctorOnly, async (req, res) => {
  const { status } = req.body;

  const doctor = await DoctorApplication.findOne({
    userId: req.user.id,
    status: "Approved",
  });

  const appt = await Appointment.findOne({
    _id: req.params.id,
    doctorApplicationId: doctor._id,
  });

  if (!appt) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  appt.status = status;
  await appt.save();

  res.json({ message: "Status updated", appointment: appt });
});

/* ================= PATIENT: EDIT ================= */
router.patch("/:id/edit", auth, async (req, res) => {
  const appt = await Appointment.findById(req.params.id);

  if (!appt || appt.patientId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (appt.status !== "Pending") {
    return res.status(400).json({ message: "Only pending appointments" });
  }

  appt.date = req.body.date;
  appt.time = req.body.time;
  await appt.save();

  res.json({ message: "Updated", appointment: appt });
});

/* ================= PATIENT: CANCEL ================= */
router.patch("/:id/cancel", auth, async (req, res) => {
  const appt = await Appointment.findById(req.params.id);

  if (!appt || appt.patientId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (appt.status !== "Pending") {
    return res.status(400).json({ message: "Only pending appointments" });
  }

  appt.status = "Cancelled";
  await appt.save();

  res.json({ message: "Cancelled", appointment: appt });
});

/* ================= DOCTOR: GET PATIENT HISTORY ================= */
router.get(
  "/patient/:patientId/history",
  auth,
  async (req, res) => {
    try {
      const doctor = await DoctorApplication.findOne({
        userId: req.user.id,
      });

      const history = await Appointment.find({
        patientId: req.params.patientId,
        doctorApplicationId: doctor._id,
      })
        .sort({ date: -1 });

      res.json(history);
    } catch (err) {
      res.status(500).json({ message: "Failed to load medical history" });
    }
  }
);



export default router;
