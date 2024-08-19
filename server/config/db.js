const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected: " + conn.connection.host);
  } catch (error) {
    console.error("MongoDB connection error: ", error.message);
    process.exit(1); // Exit the process if connection fails
  }
};

module.exports = connectDB;
