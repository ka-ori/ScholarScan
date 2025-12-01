import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import authRoutes from './routes/auth.js';
import paperRoutes from './routes/papers.js';
import userRoutes from './routes/user.js';
import noteRoutes from './routes/notes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'ScholarScan API - Milestone 1: Authentication Only' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Authentication service running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/papers', paperRoutes);
app.use('/api/user', userRoutes);
app.use('/api/notes', noteRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🎯 Milestone 1: JWT Authentication (Login + Signup)`);
});
