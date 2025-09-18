import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // yaha ensure karo

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 465,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// OTP bhejne ka helper
export const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: `"Interview App" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It expires in ${process.env.OTP_EXPIRE_MIN || 10} minutes.`,
  };

  await transporter.sendMail(mailOptions);
};
