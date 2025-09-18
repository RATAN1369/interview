import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expireAt: { type: Date, required: true },
  data: { type: Object }, // yahan user ka name & password hashed rakhenge
});

export default mongoose.model("Otp", OtpSchema);
