import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subject: {
      type: String,
      default: "Support Message",
    },

    message: {
      type: String,
      required: true,
    },

    reply: {
      type: String, // admin reply (optional)
    },

    readByAdmin: {
      type: Boolean,
      default: false,
    },

    readByUser: {
      type: Boolean,
      default: true, // user already read their own message
    },

    repliedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
