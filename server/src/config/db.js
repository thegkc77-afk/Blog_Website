const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("[MongoDB] MONGODB_URI is not defined");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(
      `[MongoDB] Connected successfully: ${conn.connection.host}`
    );
  } catch (error) {
    console.error("[MongoDB] Connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;