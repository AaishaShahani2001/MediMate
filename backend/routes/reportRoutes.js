import express from "express";
import multer from "multer";
import Report from "../models/Report.js";
import {auth} from "../middleware/auth.js";

const router = express.Router();

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: "uploads/reports",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/* ================= UPLOAD REPORT ================= */
router.post(
  "/",
  auth,
  upload.single("file"),
  async (req, res) => {
    try {
      const { title, appointmentId } = req.body;
      // console.log("USER:", req.user);
      // console.log("BODY:", req.body);
      // console.log("FILE:", req.file);

      if (!title || !req.file) {
        return res.status(400).json({ message: "Title and file required" });
      }

      const report = await Report.create({
        patientId: req.user.id || req.id,
        appointmentId: req.body.appointmentId || null,
        title: req.body.title,
        fileUrl: req.file.path,
        fileType: req.file.mimetype,
      });
      

      res.status(201).json(report);
    } catch (err) {
      res.status(500).json({ message: "Failed to upload report" });
    }
  }
);

/* ================= GET MY REPORTS ================= */
router.get("/my", auth, async (req, res) => {
  try {
    const reports = await Report.find({ patientId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch {
    res.status(500).json({ message: "Failed to fetch reports" });
  }
});

/* ================= FIND REPORT FOR EACH APPOINTMENT ================= */
router.get("/appointment/:id", auth, async (req, res) => {
  const reports = await Report.find({
    appointmentId: req.params.id,
  }).sort({ createdAt: -1 });

  res.json(reports);
});

export default router;
