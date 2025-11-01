import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import authRoutes from './routes/auth.js';
import paperRoutes from './routes/papers.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload middleware
app.use(fileUpload({
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 }, // 10MB default
  abortOnLimit: true,
  createParentPath: true
}));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'ScholarScan API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/papers', paperRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
