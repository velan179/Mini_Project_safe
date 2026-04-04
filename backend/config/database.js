import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("🔄 Connecting to Local MongoDB...");

    await mongoose.connect("mongodb://127.0.0.1:27017/tourist-safety");

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;