import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {

    name: String,
    email: String,

     // Logged-in users only
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return !this.name; // required only if NOT contact form
      },
    },

    

    senderRole: {
      type: String,
      enum: ["patient", "doctor", "admin"],
    },

    subject: {
      type: String,
      default: "Contact Message",
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
    readByPatient: {
      type: Boolean,
      default: false,
    },


    repliedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
