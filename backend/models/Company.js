// backend/models/Company.js
import mongoose from "mongoose";

const roundSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    notes: { type: String, trim: true },
    result: {
      type: String,
      enum: ["pending", "pass", "fail", "selected"],
      default: "pending",
    },
  },
  { _id: false }
);

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rounds: { type: [roundSchema], default: [] },

    // moderation
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String, default: "" },

    // who created
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // NEW meta
    year: { type: Number, min: 2000 }, // e.g., 2024
    college: { type: String, trim: true, maxlength: 120 },
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);
