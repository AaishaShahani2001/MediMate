import express from "express";
import multer from "multer";
import DoctorApplication from "../models/DoctorApplication.js";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";
import { doctorOnly } from "../middleware/doctorOnly.js";
import uploadAvatar from "../middleware/uploadAvatar.js";


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
        workplace: req.body.workplace,
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

router.patch("/:id/status", auth, adminOnly, async (req, res) => {
  const { status } = req.body;

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const app = await DoctorApplication.findById(req.params.id);
  if (!app) return res.status(404).json({ message: "Not found" });

  // 🔐 LOCK STATUS
  if (app.status !== "Pending") {
    return res.status(400).json({
      message: "Status already finalized and cannot be changed",
    });
  }

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
    }).sort({ createdAt: -1 })
    .select(
        "fullName specialization experience about avatar workplace"
      );

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
    }).select(
      "fullName specialization degree experience consultationFee about avatar workplace"
    );

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
      userId: req.user._id,
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor application not found"
      });
    }

    if (doctor.status !== "Approved") {
      return res.status(403).json({
        message: "Doctor application not approved yet",
        status: doctor.status
      });
    }

    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= DOCTOR: MY PROFILE ================= */
router.get("/me", auth, doctorOnly, async (req, res) => {
  const doctor = await DoctorApplication.findOne({
    userId: req.user._id,
    status: "Approved",
  });

  if (!doctor) {
    return res.status(404).json({
      message: "Doctor profile not found or not approved",
    });
  }

  res.json(doctor);
});

/* ================= DOCTOR: UPDATE MY PROFILE ================= */

router.patch(
  "/me",
  auth,
  doctorOnly,
  uploadAvatar.single("avatar"),
  async (req, res) => {
    try {
      const doctor = await DoctorApplication.findOne({
        userId: req.user._id,
        status: { $in: ["Approved", "approved"] },
      });

      if (!doctor) {
        return res.status(404).json({
          message: "Doctor profile not found or not approved",
        });
      }

      // ---------- Update fields ----------
      doctor.fullName = req.body.fullName ?? doctor.fullName;
      doctor.phone = req.body.phone ?? doctor.phone;
      doctor.specialization = req.body.specialization ?? doctor.specialization;
      doctor.degree = req.body.degree ?? doctor.degree;
      doctor.experience = req.body.experience ?? doctor.experience;
      doctor.consultationFee = req.body.consultationFee ?? doctor.consultationFee;
      doctor.about = req.body.about ?? doctor.about;
      doctor.workplace = req.body.workplace;
      
      // ---------- REMOVE AVATAR ----------
      if (req.body.removeAvatar === "true") {
        doctor.avatar = "";
      }

      // ---------- UPLOAD NEW AVATAR ----------
      if (req.file) {
        doctor.avatar = req.file.path;
      }

      await doctor.save();
      return res.json(doctor);

    } catch (err) {
      console.error("Doctor profile update error:", err);

      // PREVENT DOUBLE RESPONSE
      if (!res.headersSent) {
        return res.status(500).json({
          message: "Failed to update profile",
        });
      }
    }
  }
);



/* ================= DOCTOR: GET APPOINTMENT FOR EACH DOCTOR ================= */
router.get(
  "/appointment/:appointmentId",
  auth,
  async (req, res) => {
    try {
      const reports = await Report.find({
        appointmentId: req.params.appointmentId,
      }).sort({ createdAt: -1 });

      res.json(reports);
    } catch {
      res.status(500).json({ message: "Failed to load reports" });
    }
  }
);


export default router;
