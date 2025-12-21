import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },

    // patient profile fields
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
      default: "Male",
    },
    phone: { type: String },
    blood: {
      type: String,
      enum: ["A+","A-","B+","B-","O+","O-","AB+","AB-"],
      default: "O+",
    },

    dob: { type: Date },   // ✅ ADD THIS
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
