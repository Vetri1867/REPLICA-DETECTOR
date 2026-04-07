require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const compareRoutes = require('./routes/compare');
const uploadRoutes = require('./routes/upload');
const reportRoutes = require('./routes/report');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/compare', compareRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Replica Detector API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Replica Detector API running on http://localhost:${PORT}`);
});
