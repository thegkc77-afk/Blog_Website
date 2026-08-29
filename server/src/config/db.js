const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blog-app';

  try {
    // Set connection timeout to 3 seconds for fast fallback
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`[MongoDB] Primary connection to ${uri} failed (${err.message}).`);
    console.log('[MongoDB] Initializing automated in-memory MongoDB instance...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();

      const conn = await mongoose.connect(mongoUri);
      console.log(`[MongoDB] Connected to In-Memory Database: ${conn.connection.host}`);
    } catch (memErr) {
      console.error('[MongoDB] In-Memory connection failed:', memErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
