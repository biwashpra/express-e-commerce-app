import mongoose from "mongoose";
import { MONGODB_URI } from "./env.js";

const connectDB = async () => {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI environment variable is not defined. Please check your .env file.",
    );
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error(`Error connecting database: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
