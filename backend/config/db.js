import mongoose from "mongoose";
import "dotenv/config";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // helpful for quick failures
    });
    const { host, name } = mongoose.connection;
    console.log(`✅ MongoDB Atlas connected → ${host}/${name}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}
