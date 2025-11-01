import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import paperRoutes from './routes/papers.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
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

// Serve uploaded files with proper headers
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads');
app.use('/uploads', (req, res, next) => {
  // Set proper CORS headers for file serving - allow both frontend ports
  const origin = req.headers.origin;
  if (origin === 'http://localhost:5173' || origin === 'http://localhost:5174') {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  
  // Set content type for PDFs
  if (req.path.endsWith('.pdf')) {
    res.header('Content-Type', 'application/pdf');
    res.header('Content-Disposition', 'inline');
  }
  
  next();
}, express.static(uploadDir));

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
