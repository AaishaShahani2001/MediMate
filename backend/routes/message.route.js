import express from "express";
import Message from "../models/Message.js";
import { auth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/adminOnly.js";


const router = express.Router();


/* =====================================================
   CREATE MESSAGE (LOGGED-IN USER ONLY)
   POST /api/messages
===================================================== */
router.post("/", auth, async (req, res) => {
  try {
    console.log("USER:", req.user);
    console.log("REQ.USER:", req.user);

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const msg = await Message.create({
      sender: req.user._id,
      message,
      readByAdmin: false,
      readByUser: true,
    });

    res.status(201).json(msg);
  } catch (err) {
    console.error("CREATE MESSAGE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});



/* =====================================================
   GET MESSAGES (ADMIN – ALL)
   GET /api/messages/admin
===================================================== */
router.get("/admin", auth, adminOnly, async (req, res) => {
  const messages = await Message.find()
    .populate("sender", "name email role")
    .sort({ createdAt: -1 });

  await Message.updateMany(
    { readByAdmin: false },
    { readByAdmin: true }
  );

  res.json(messages);
});


/* =====================================================
   GET MESSAGES (PATIENT – ONLY OWN)
   GET /api/messages/my
===================================================== */
router.get("/my", auth, async (req, res) => {
  try {
    const messages = await Message.find({
      sender: req.user._id,
    }).sort({ createdAt: -1 });

    // mark replies as read
    await Message.updateMany(
      { sender: req.user._id, reply: { $exists: true } },
      { readByUser: true }
    );

    res.json(messages);
  } catch (err) {
    console.error("FETCH MY MSG ERROR:", err);
    res.status(500).json({ message: "Failed to load messages" });
  }
});

/* =====================================================
   REPLY TO MESSAGE (ADMIN)
===================================================== */
router.patch("/:id/reply", auth, adminOnly, async (req, res) => {
  const { reply } = req.body;

  if (!reply) {
    return res.status(400).json({ message: "Reply is required" });
  }

  const msg = await Message.findById(req.params.id);
  if (!msg) return res.status(404).json({ message: "Message not found" });

  msg.reply = reply;
  msg.repliedAt = new Date();
  msg.readByAdmin = true;
  msg.readByUser = false; 
  await msg.save();
  res.json(msg);
});

/* =====================================================
   UNREAD COUNT (ADMIN)
===================================================== */
router.get("/admin/unread-count", auth, adminOnly, async (req, res) => {
  const count = await Message.countDocuments({ readByAdmin: false });
  res.json({ count });
});


/* =====================================================
   DELETE MESSAGE (ADMIN)
===================================================== */
router.delete("/:id", auth, adminOnly, async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

/* =====================================================
   MARK READ (ADMIN)
===================================================== */
router.patch("/admin/mark-read", auth, adminOnly, async (req, res) => {
  await Message.updateMany(
    { readByAdmin: false },
    { readByAdmin: true }
  );
  res.json({ success: true });
});

export default router;
