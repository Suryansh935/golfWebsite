import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    console.log("URL:", process.env.MONGODB_URL); // debug

    await mongoose.connect(process.env.MONGODB_URL);

    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection failed");
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;