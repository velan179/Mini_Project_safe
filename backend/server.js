import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import trustedContactRoutes from './routes/trustedContactRoutes.js';
import evidenceRoutes from './routes/evidenceRoutes.js';
import bloodDonorRoutes from './routes/bloodDonorRoutes.js';
import bloodBankRoutes from './routes/bloodBankRoutes.js';
import bloodRequestRoutes from './routes/bloodRequestRoutes.js';
import sosAlertRoutes from './routes/sosAlertRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import assistantRoutes from './routes/assistantRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Health Check Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Tourist Safety Backend is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', trustedContactRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/blood/donors', bloodDonorRoutes);
app.use('/api/blood/banks', bloodBankRoutes);
app.use('/api/blood/requests', bloodRequestRoutes);
app.use('/api/sos-alerts', sosAlertRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/assistant', assistantRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global Error Handler
app.use(errorHandler);

// Connect to Database and Start Server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
      console.log(`📝 API Documentation: http://localhost:${PORT}/api`);
      console.log(`🗂️ Uploads Directory: ./uploads`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
