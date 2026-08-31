const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../server/src/config/db');
const errorHandler = require('../server/src/middleware/error.middleware');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Blog Application API is active and running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', require('../server/src/routes/auth.routes'));
app.use('/api/blogs', require('../server/src/routes/blog.routes'));

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Endpoint not found`,
  });
});

app.use(errorHandler);

module.exports = app;
