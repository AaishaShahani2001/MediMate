import express from "express";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/users/me
 * Get logged-in user's profile
 */
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("GET /users/me error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PUT /api/users/me
 * Update logged-in user's profile
 */
router.put("/me", auth, async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "phone",
      "gender",
      "blood",
      "dob",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.error("PUT /users/me error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
