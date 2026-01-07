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

    date: { type: Date, required: true },
    time: { type: String, required: true },

    status: {
      type: String,
      enum: ["Pending", "Booked", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
