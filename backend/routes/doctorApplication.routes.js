import express from "express";
import multer from "multer";
import DoctorApplication from "../models/DoctorApplication.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // simple local storage (semester OK)

router.post("/", auth, upload.array("documents", 3), async (req, res) => {
  try {
    const docs = (req.files || []).map((f) => ({
      name: f.originalname,
      url: `/uploads/${f.filename}`,
    }));

    const app = await DoctorApplication.create({
      userId: req.user.id,
      ...req.body,
      documents: docs,
    });

    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ message: "Failed to submit application" });
  }
});

export default router;
