import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctorApplicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorApplication",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String, // "08:30"
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },

    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
