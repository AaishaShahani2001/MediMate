import mongoose from "mongoose";

const doctorApplicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    fullName: String,
    email: String,
    phone: String,
    specialization: String,
    degree: String,
    experience: String,
    consultationFee: String,
    about: String,

    documents: [
      {
        url: String,
        name: String,
      },
    ],

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("DoctorApplication", doctorApplicationSchema);
