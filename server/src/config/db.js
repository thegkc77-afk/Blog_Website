const mongoose = require("mongoose");

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });

      console.log(
        `[MongoDB] Connected successfully to Cloud DB: ${conn.connection.host}`
      );
      return;
    } catch (error) {
      console.error("[MongoDB] Cloud connection failed:", error.message);
      try {
        await mongoose.disconnect();
      } catch (discErr) {
        // ignore disconnect error
      }
      console.log("[MongoDB] Attempting fallback to In-Memory MongoDB server...");
    }
  }

  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`[MongoDB] Connected successfully to In-Memory DB: ${conn.connection.host}`);
    } catch (memError) {
      console.error("[MongoDB] In-Memory server initialization failed:", memError.message);
    }
  }
};

module.exports = connectDB;