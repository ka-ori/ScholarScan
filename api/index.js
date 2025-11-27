const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  res.status(501).json({ 
    error: 'File upload is not available in the cloud deployment',
    message: 'PDF upload requires local server. Please run the backend locally for full functionality.',
    hint: 'Run: cd backend && npm run dev'
  });
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

