const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { put } = require('@vercel/blob');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api', (req, res) => {
  res.json({ 
    message: 'ScholarScan API is running',
    env: {
      hasDatabase: !!process.env.DATABASE_URL,
      hasJWT: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Authentication service running',
    env: {
      hasDatabase: !!process.env.DATABASE_URL,
      hasJWT: !!process.env.JWT_SECRET
    }
  });
});

// Test endpoint
app.post('/api/test', (req, res) => {
  res.json({ 
    message: 'POST request received',
    body: req.body,
    headers: req.headers
  });
});

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name }
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ id: user.id, email: user.email, name: user.name, createdAt: user.createdAt });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Auth middleware for protected routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Papers routes
app.get('/api/papers', authenticateToken, async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    
    const where = { userId: req.user.userId };
    
    if (category && category !== 'All Categories') {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { keywords: { hasSome: [search] } }
      ];
    }
    
    const papers = await prisma.paper.findMany({
      where,
      orderBy: { uploadedAt: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit)
    });
    
    const total = await prisma.paper.count({ where });
    
    res.json({ 
      papers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get papers error:', error);
    res.status(500).json({ error: 'Failed to fetch papers' });
  }
});

app.get('/api/papers/:id', authenticateToken, async (req, res) => {
  try {
    const paper = await prisma.paper.findFirst({
      where: { 
        id: req.params.id,
        userId: req.user.userId
      }
    });
    
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    
    res.json({ paper });
  } catch (error) {
    console.error('Get paper error:', error);
    res.status(500).json({ error: 'Failed to fetch paper' });
  }
});

app.post('/api/papers', authenticateToken, async (req, res) => {
  try {
    // This endpoint expects a JSON body with:
    // - title, authors, summary, keywords, category, fileName, fileSize, etc.
    // - blobUrl: URL to the blob in Vercel Blob storage
    // - or pdfData: base64 encoded PDF to upload to Vercel Blob
    
    const { 
      title, authors, summary, keywords, category, 
      fileName, fileSize, pdfData, blobUrl, publicationYear, journal, doi
    } = req.body;

    if (!title || !fileName) {
      return res.status(400).json({ error: 'Title and fileName are required' });
    }

    let finalBlobUrl = blobUrl;

    // If pdfData is provided (base64), upload it to Vercel Blob
    if (pdfData && !blobUrl && process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const buffer = Buffer.from(pdfData, 'base64');
        const timestamp = Date.now();
        const [nameWithoutExt, ext] = fileName.split(/\.(?=[^.]*$)/);
        const uniqueFilename = `papers/${timestamp}-${nameWithoutExt}.${ext}`;

        const blob = await put(uniqueFilename, buffer, {
          access: 'public',
          contentType: 'application/pdf',
          addRandomSuffix: false,
        });

        finalBlobUrl = blob.url;
        console.log('PDF uploaded to Vercel Blob:', finalBlobUrl);
      } catch (blobError) {
        console.error('Blob upload error:', blobError);
        return res.status(500).json({ error: 'Failed to upload PDF to blob storage' });
      }
    }

    if (!finalBlobUrl) {
      return res.status(400).json({ error: 'No PDF URL or data provided' });
    }

    // Create paper in database
    const paper = await prisma.paper.create({
      data: {
        title,
        authors: authors || null,
        summary: summary || '',
        keywords: keywords || [],
        category: category || 'Other',
        fileName,
        filePath: finalBlobUrl, // Store blob URL in filePath
        fileSize: fileSize || 0,
        publicationYear: publicationYear || null,
        journal: journal || null,
        doi: doi || null,
        blobUrl: finalBlobUrl,
        userId: req.user.userId
      }
    });

    res.status(201).json({
      message: 'Paper created successfully',
      paper
    });
  } catch (error) {
    console.error('Create paper error:', error);
    res.status(500).json({ error: 'Failed to create paper' });
  }
});

app.put('/api/papers/:id', authenticateToken, async (req, res) => {
  try {
    const { title, authors, summary, keywords, category, publicationYear, journal, doi } = req.body;
    
    const paper = await prisma.paper.findFirst({
      where: { id: req.params.id, userId: req.user.userId }
    });
    
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    
    const updated = await prisma.paper.update({
      where: { id: req.params.id },
      data: {
        title: title || paper.title,
        authors: authors !== undefined ? authors : paper.authors,
        summary: summary || paper.summary,
        keywords: keywords || paper.keywords,
        category: category || paper.category,
        publicationYear: publicationYear !== undefined ? publicationYear : paper.publicationYear,
        journal: journal !== undefined ? journal : paper.journal,
        doi: doi !== undefined ? doi : paper.doi
      }
    });
    
    res.json({ paper: updated });
  } catch (error) {
    console.error('Update paper error:', error);
    res.status(500).json({ error: 'Failed to update paper' });
  }
});

app.delete('/api/papers/:id', authenticateToken, async (req, res) => {
  try {
    const paper = await prisma.paper.findFirst({
      where: { id: req.params.id, userId: req.user.userId }
    });
    
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    
    await prisma.paper.delete({ where: { id: req.params.id } });
    
    res.json({ message: 'Paper deleted successfully' });
  } catch (error) {
    console.error('Delete paper error:', error);
    res.status(500).json({ error: 'Failed to delete paper' });
  }
});

// PDF viewing - returns blob URL for cloud deployment
app.get('/api/papers/:id/pdf', authenticateToken, async (req, res) => {
  try {
    const paper = await prisma.paper.findFirst({
      where: { id: req.params.id, userId: req.user.userId }
    });
    
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    
    // If stored in Vercel Blob, return the blob URL
    if (paper.blobUrl) {
      return res.json({ url: paper.blobUrl });
    }

    // If stored locally, return error
    res.status(501).json({ 
      error: 'PDF viewing not available',
      message: 'PDF files are stored on local server. Please run the backend locally to view PDFs.',
      hint: 'Run: cd backend && npm run dev',
      fileName: paper.fileName
    });
  } catch (error) {
    console.error('Get PDF error:', error);
    res.status(500).json({ error: 'Failed to fetch PDF' });
  }
});

// User routes
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const paperCount = await prisma.paper.count({ where: { userId: req.user.userId } });
    
    res.json({ user: { ...user, paperCount } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.get('/api/user/stats', authenticateToken, async (req, res) => {
  try {
    const totalPapers = await prisma.paper.count({ where: { userId: req.user.userId } });
    
    const categoryCounts = await prisma.paper.groupBy({
      by: ['category'],
      where: { userId: req.user.userId },
      _count: { category: true }
    });
    
    const recentPapers = await prisma.paper.findMany({
      where: { userId: req.user.userId },
      orderBy: { uploadedAt: 'desc' },
      take: 5,
      select: { id: true, title: true, category: true, uploadedAt: true }
    });
    
    res.json({ totalPapers, categoryCounts, recentPapers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Catch-all for debugging
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    debug: {
      method: req.method,
      path: req.path,
      url: req.url,
      originalUrl: req.originalUrl,
      baseUrl: req.baseUrl
    }
  });
});

module.exports = app;

