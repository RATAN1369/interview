import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

async function sendMail() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true", // true for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"My App" <${process.env.SMTP_USER}>`,
      to: "yourEmail@gmail.com", // replace with your test email
      subject: "SMTP Test ✔",
      text: "Hello, this is a test email from my app!",
    });

    console.log("✅ Message sent:", info.messageId);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

sendMail();
//this file is just to check whether smtp working or not.
