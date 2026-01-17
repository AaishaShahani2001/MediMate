import express from "express";
import Message from "../models/Message.js";
import { auth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = express.Router();

/* =====================================================
   PUBLIC CONTACT FORM (NO LOGIN REQUIRED)
   POST /api/messages/contact
===================================================== */
router.post("/contact", async (req, res) => {
  try {
    //console.log("CONTACT BODY:", req.body); // 🔍 DEBUG

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const msg = await Message.create({
      name,
      email,
      message,
      readByAdmin: false,
    });

    res.status(201).json(msg);
  } catch (err) {
    console.error("CONTACT ERROR:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});


/* =====================================================
   CREATE MESSAGE (LOGGED-IN PATIENT)
   POST /api/messages
===================================================== */
router.post("/", auth, async (req, res) => {
  try {
    const msg = await Message.create({
      sender: req.user._id,
      senderRole: req.user.role, // patient
      message: req.body.message,
      readByAdmin: false,
    });

    res.status(201).json(msg);
  } catch {
    res.status(500).json({ message: "Failed to send message" });
  }
});

/* =====================================================
   GET MESSAGES (ADMIN)
   GET /api/messages/admin
===================================================== */
router.get("/admin", auth, adminOnly, async (req, res) => {
  const messages = await Message.find()
    .populate("sender", "name email")
    .sort({ createdAt: -1 });

  // mark as read
  await Message.updateMany(
    { readByAdmin: false },
    { readByAdmin: true }
  );

  res.json(messages);
});

/* =====================================================
   GET MESSAGES (PATIENT)
   GET /api/messages/my
===================================================== */
router.get("/my", auth, async (req, res) => {
  const messages = await Message.find({
    sender: req.user._id,
  }).sort({ createdAt: -1 });

  res.json(messages);
});

/* =====================================================
   REPLY TO MESSAGE (ADMIN)
   PATCH /api/messages/:id/reply
===================================================== */
router.patch("/:id/reply", auth, adminOnly, async (req, res) => {
  const msg = await Message.findById(req.params.id);
  if (!msg) {
    return res.status(404).json({ message: "Message not found" });
  }

  msg.reply = req.body.reply;
  msg.repliedAt = new Date();
  msg.readByAdmin = true;

  await msg.save();
  res.json(msg);
});

/* =====================================================
   UNREAD COUNT (ADMIN)
   GET /api/messages/admin/unread-count
===================================================== */
router.get("/admin/unread-count", auth, adminOnly, async (req, res) => {
  const count = await Message.countDocuments({
    readByAdmin: false,
  });

  res.json({ count });
});

/* =====================================================
   DELETE MESSAGE (ADMIN)
   DELETE /api/messages/:id
===================================================== */
router.delete("/:id", auth, adminOnly, async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});



router.patch("/admin/mark-read", adminOnly, async (req, res) => {
  await Message.updateMany(
    { readByAdmin: false },
    { readByAdmin: true }
  );
  res.json({ success: true });
});


export default router;
