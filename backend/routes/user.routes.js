import express from "express";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";
import uploadAvatar from "../middleware/uploadAvatar.js";

const router = express.Router();

/* ================= GET LOGGED-IN USER ================= */
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to load profile" });
  }
});

/**
 * PUT /api/users/me
 * Update logged-in user's profile
 */
router.put(
  "/me",
  auth,
  uploadAvatar.single("avatar"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) return res.status(404).json({ message: "User not found" });

      // Update fields
      user.name = req.body.name ?? user.name;
      user.phone = req.body.phone ?? user.phone;
      user.gender = req.body.gender ?? user.gender;
      user.blood = req.body.blood ?? user.blood;
      user.dob = req.body.dob ?? user.dob;

      //  REMOVE AVATAR
      if (req.body.removeAvatar === "true") {
        user.avatar = "";
      }

      //  UPLOAD NEW AVATAR
      if (req.file) {
        user.avatar = req.file.path;
      }

      await user.save();

      res.json({ user });
    } catch (err) {
      console.error("Update profile error:", err);
      res.status(500).json({ message: "Profile update failed" });
    }
  }
);


export default router;
