const mongoose = require('mongoose');
const dns = require('dns');

// Configure public DNS resolvers to handle MongoDB Atlas SRV records on Windows/local networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  // Ignore if setting custom DNS servers fails in restricted environments
}

// Helper to sanitize URI for safe logging (hides password)
const sanitizeUri = (uri) => {
  if (!uri) return '';
  return uri.replace(/\/\/(.*?):(.*?)@/, '//$1:****@');
};

// Helper to auto-fix unencoded special characters in password if present
const normalizeMongoUri = (rawUri) => {
  if (!rawUri) return rawUri;
  try {
    const match = rawUri.match(/^(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@(.+)$/);
    if (match) {
      const [, prefix, user, pass, rest] = match;
      // If password contains unencoded '#' or unencoded '%'
      if (pass.includes('#') || (pass.includes('%') && !/%[0-9A-Fa-f]{2}/.test(pass))) {
        const encodedPass = encodeURIComponent(pass);
        return `${prefix}${user}:${encodedPass}@${rest}`;
      }
    }
  } catch (e) {
    // Return original if parsing fails
  }
  return rawUri;
};

const connectDB = async () => {
  let uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blog-app';
  uri = normalizeMongoUri(uri);

  try {
    // Set connection timeout to 5 seconds
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (err) {
    const safeUri = sanitizeUri(uri);
    console.warn(`[MongoDB] Primary connection to ${safeUri} failed (${err.message}).`);
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


