import express from "express";
import multer from "multer";
import DoctorApplication from "../models/DoctorApplication.js";
import User from "../models/User.js";

import { auth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = express.Router();

/* ---------------- MULTER SETUP ---------------- */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/doctor-docs");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/* ================= USER: APPLY AS DOCTOR ================= */

router.post(
  "/",
  auth,
  upload.fields([
    { name: "nic", maxCount: 1 },
    { name: "certifications", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const nicFile = req.files?.nic?.[0];
      const certFiles = req.files?.certifications || [];

      if (!nicFile) {
        return res.status(400).json({ message: "NIC file is required" });
      }

      const application = await DoctorApplication.create({
        userId: req.user.id,

        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        specialization: req.body.specialization,
        degree: req.body.degree,
        experience: req.body.experience,
        consultationFee: req.body.consultationFee,
        about: req.body.about,

        nic: {
          fileName: nicFile.originalname,
          filePath: nicFile.path,
        },

        certifications: certFiles.map((f) => ({
          fileName: f.originalname,
          filePath: f.path,
        })),
      });

      res.status(201).json(application);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Doctor application failed" });
    }
  }
);

/* ================= ADMIN: GET ALL REQUESTS ================= */

router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const applications = await DoctorApplication.find()
      .populate("userId", "email role")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
});

/* ================= ADMIN: APPROVE / REJECT ================= */

router.patch("/:id", auth, adminOnly, async (req, res) => {
  const { status } = req.body;

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const app = await DoctorApplication.findById(req.params.id);
  if (!app) return res.status(404).json({ message: "Not found" });

  app.status = status;
  await app.save();

  // ROLE UPGRADE
  if (status === "Approved") {
    await User.findByIdAndUpdate(app.userId, { role: "doctor" });
  }

  res.json(app);
});

/* ================= PUBLIC: GET APPROVED DOCTORS ================= */
router.get("/public", async (req, res) => {
  try {
    const doctors = await DoctorApplication.find({
      status: "Approved",
    }).sort({ createdAt: -1 });

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Failed to load doctors" });
  }
});

/* ================= PUBLIC: GET SINGLE DOCTOR ================= */
router.get("/public/:id", async (req, res) => {
  try {
    const doctor = await DoctorApplication.findOne({
      _id: req.params.id,
      status: "Approved",
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Failed to load doctor" });
  }
});

/*============== Get approved doctor profile for logged-in user===============*/
router.get("/me", auth, async (req, res) => {
  try {
    const doctor = await DoctorApplication.findOne({
      userId: req.userId,
      status: "Approved",
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found or not approved",
      });
    }

    res.json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
