import mongoose from "mongoose";
import "dotenv/config";
const mongoURL = process.env.MONGODB_URL;
if (!mongoURL) {
  throw new Error("MongoDB URL Kaida?");
}
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
