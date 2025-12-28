import express from "express";
import multer from "multer";
import DoctorApplication from "../models/DoctorApplication.js";
import { auth } from "../middleware/auth.js";

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

/* ---------------- ROUTE ---------------- */

router.post(
  "/",
  auth,
  upload.fields([
    { name: "nic", maxCount: 1 },              //  NIC
    { name: "certifications", maxCount: 5 },   //  Licenses / Certificates
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

export default router;
