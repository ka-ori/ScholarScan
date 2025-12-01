const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { put } = require('@vercel/blob');
const Busboy = require('busboy');

// Lazy load pdf-parse and Gemini to avoid startup issues
let pdfParse = null;
let GoogleGenerativeAI = null;

const loadPdfParse = () => {
  if (!pdfParse) {
    try {
      pdfParse = require('pdf-parse-fork');
    } catch (e) {
      console.error('Failed to load pdf-parse-fork:', e.message);
    }
  }
  return pdfParse;
};

const loadGemini = () => {
  if (!GoogleGenerativeAI) {
    try {
      GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;
    } catch (e) {
      console.error('Failed to load Gemini:', e.message);
    }
  }
  return GoogleGenerativeAI;
};

const app = express();

// Initialize Prisma client for serverless (reuse connection)
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// AI Analysis function
async function analyzePaper(text) {
  console.log('analyzePaper called, text length:', text?.length);
  
  // Lazy load Gemini
  const GeminiAI = loadGemini();
  console.log('GeminiAI loaded:', !!GeminiAI);
  console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
  
  if (!GeminiAI || !process.env.GEMINI_API_KEY) {
    console.log('Missing GeminiAI or API key');
    return {
      title: 'Untitled Paper',
      authors: null,
      summary: 'AI analysis not available. GeminiAI: ' + !!GeminiAI + ', API Key: ' + !!process.env.GEMINI_API_KEY,
      keywords: [],
      keyFindings: [],
      category: 'Other',
      publicationYear: null,
      journal: null,
      doi: null
    };
  }

  try {
    console.log('Creating Gemini instance...');
    const genAI = new GeminiAI(process.env.GEMINI_API_KEY);
    console.log('Getting model...');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // Truncate text if too long
    const maxChars = 30000;
    const truncatedText = text.length > maxChars ? text.substring(0, maxChars) + '...' : text;
    console.log('Text truncated to:', truncatedText.length);

    const prompt = `Analyze this research paper and extract the following information in JSON format:
{
  "title": "exact title of the paper",
  "authors": "comma-separated list of authors",
  "summary": "comprehensive 3-4 paragraph summary of the paper's main contributions, methodology, and findings",
  "keywords": ["keyword1", "keyword2", ...] (5-8 relevant keywords),
  "keyFindings": [
    {
      "finding": "key finding or result",
      "section": "which section this is from",
      "pageNumber": estimated page number,
      "confidence": "high/medium/low",
      "textSnippet": "relevant quote from the paper"
    }
  ] (3-5 key findings),
  "category": "one of: Computer Science, Artificial Intelligence, Machine Learning, Natural Language Processing, Computer Vision, Bioinformatics, Physics, Mathematics, Chemistry, Biology, Medicine, Engineering, Social Sciences, Economics, Psychology, Other",
  "publicationYear": year as number or null,
  "journal": "journal or conference name if mentioned",
  "doi": "DOI if found in the text"
}

Paper text:
${truncatedText}

Return ONLY valid JSON, no markdown or explanation.`;

    console.log('Calling Gemini API...');
    const result = await model.generateContent(prompt);
    console.log('Got result, getting response...');
    const response = await result.response;
    let jsonText = response.text().trim();
    console.log('Response text length:', jsonText.length);
    
    // Clean up response
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.slice(7);
    }
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.slice(3);
    }
    if (jsonText.endsWith('```')) {
      jsonText = jsonText.slice(0, -3);
    }
    
    console.log('Parsing JSON...');
    const analysis = JSON.parse(jsonText.trim());
    console.log('Analysis complete:', analysis.title);
    return analysis;
  } catch (error) {
    console.error('AI analysis error:', error.message);
    console.error('Error stack:', error.stack);
    return {
      title: 'Untitled Paper',
      authors: null,
      summary: 'AI analysis failed: ' + (error.message || 'Unknown error'),
      keywords: [],
      keyFindings: [],
      category: 'Other',
      publicationYear: null,
      journal: null,
      doi: null
    };
  }
}

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
    console.log('Login attempt for:', req.body?.email);
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('Invalid password for:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set!');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Login successful for:', email);
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt }
    });
  } catch (error) {
    console.error('Login error:', error.message, error.stack);
    res.status(500).json({ 
      error: 'A server error has occurred',
      message: error.message
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
    const { 
      category, 
      search, 
      sortBy = 'uploadedAt', 
      order = 'desc',
      sort, // Support 'sort' param from requirement
      page = 1,
      limit = 10
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Handle sort alias
    let finalSortBy = sortBy;
    let finalOrder = order;

    if (sort === 'date') {
      finalSortBy = 'uploadedAt';
      finalOrder = 'desc';
    } else if (sort === 'title') {
      finalSortBy = 'title';
      finalOrder = 'asc';
    }
    
    const where = { userId: req.user.userId };
    
    if (category && category !== 'All Categories') {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { authors: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { keywords: { hasSome: [search] } }
      ];
    }
    
    const papers = await prisma.paper.findMany({
      where,
      orderBy: { [finalSortBy]: finalOrder },
      skip,
      take: limitNum,
      select: {
        id: true,
        title: true,
        authors: true,
        summary: true,
        keywords: true,
        category: true,
        fileName: true,
        fileSize: true,
        uploadedAt: true,
        publicationYear: true,
        journal: true,
        doi: true
      }
    });
    
    const totalCount = await prisma.paper.count({ where });
    const totalPages = Math.ceil(totalCount / limitNum);
    
    res.json({ 
      papers,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
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
  // Check if Vercel Blob is configured
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(501).json({ 
      error: 'File upload not available',
      message: 'Vercel Blob storage is not configured. Please add BLOB_READ_WRITE_TOKEN to your environment variables.',
    });
  }

  const contentType = req.headers['content-type'] || '';
  
  // Handle multipart/form-data (file upload)
  if (contentType.includes('multipart/form-data')) {
    try {
      const busboy = Busboy({ headers: req.headers });
      let fileBuffer = null;
      let fileName = null;
      let fileSize = 0;

      const filePromise = new Promise((resolve, reject) => {
        busboy.on('file', (fieldname, file, info) => {
          console.log('Receiving file:', info.filename, info.mimeType);
          
          if (info.mimeType !== 'application/pdf') {
            reject(new Error('Only PDF files are allowed'));
            return;
          }
          
          fileName = info.filename;
          const chunks = [];
          
          file.on('data', (chunk) => {
            chunks.push(chunk);
            fileSize += chunk.length;
          });
          
          file.on('end', () => {
            fileBuffer = Buffer.concat(chunks);
            console.log('File received:', fileName, fileSize, 'bytes');
          });
        });

        busboy.on('finish', () => {
          if (fileBuffer) {
            resolve({ fileBuffer, fileName, fileSize });
          } else {
            reject(new Error('No file received'));
          }
        });

        busboy.on('error', reject);
      });

      req.pipe(busboy);
      
      const { fileBuffer: buffer, fileName: name, fileSize: size } = await filePromise;
      
      // Upload to Vercel Blob
      const timestamp = Date.now();
      const safeName = name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueFilename = `papers/${timestamp}-${safeName}`;

      console.log('Uploading to Vercel Blob:', uniqueFilename);
      
      const blob = await put(uniqueFilename, buffer, {
        access: 'public',
        contentType: 'application/pdf',
        addRandomSuffix: false,
      });

      console.log('PDF uploaded to Vercel Blob:', blob.url);

      // Extract text from PDF and analyze with AI
      let analysis = {
        title: name.replace('.pdf', '').replace(/_/g, ' '),
        authors: null,
        summary: 'Paper uploaded successfully.',
        keywords: [],
        keyFindings: [],
        category: 'Other',
        publicationYear: null,
        journal: null,
        doi: null
      };

      let extractedText = '';
      
      // Step 1: Extract text from PDF
      try {
        console.log('Step 1: Loading pdf-parse-fork...');
        const pdfParseLib = loadPdfParse();
        if (pdfParseLib) {
          console.log('Step 2: Parsing PDF buffer...');
          const pdfData = await pdfParseLib(buffer);
          extractedText = pdfData.text || '';
          console.log('Step 3: Extracted text length:', extractedText.length);
        } else {
          console.log('pdf-parse-fork not available');
          analysis.summary = 'PDF text extraction not available. Paper uploaded successfully.';
        }
      } catch (pdfError) {
        console.error('PDF extraction error:', pdfError.message, pdfError.stack);
        analysis.summary = 'PDF text extraction failed: ' + pdfError.message;
      }

      // Step 2: Run AI analysis if we have text
      if (extractedText && extractedText.length > 100) {
        try {
          console.log('Step 4: Running AI analysis...');
          console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
          analysis = await analyzePaper(extractedText);
          console.log('Step 5: AI analysis complete:', analysis.title);
        } catch (aiError) {
          console.error('AI analysis error:', aiError.message, aiError.stack);
          analysis.summary = 'AI analysis failed: ' + aiError.message;
        }
      } else if (extractedText.length <= 100) {
        analysis.summary = 'PDF has too little text content for analysis. Paper uploaded successfully.';
      }

      // Store summary with key findings as JSON
      const summaryWithFindings = JSON.stringify({
        summary: analysis.summary,
        keyFindings: analysis.keyFindings || []
      });

      // Create paper in database
      const paper = await prisma.paper.create({
        data: {
          title: analysis.title || name.replace('.pdf', '').replace(/_/g, ' '),
          authors: analysis.authors || null,
          summary: summaryWithFindings,
          keywords: analysis.keywords || [],
          category: analysis.category || 'Other',
          fileName: name,
          filePath: blob.pathname,
          fileSize: size,
          publicationYear: analysis.publicationYear || null,
          journal: analysis.journal || null,
          doi: analysis.doi || null,
          blobUrl: blob.url,
          userId: req.user.userId
        }
      });

      return res.status(201).json({
        message: 'Paper uploaded and analyzed successfully!',
        paper: {
          ...paper,
          summaryText: analysis.summary,
          keyFindings: analysis.keyFindings || []
        }
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ error: error.message || 'Failed to upload file' });
    }
  }
  
  // Handle JSON body (for programmatic creation)
  try {
    const { 
      title, authors, summary, keywords, category, 
      fileName, fileSize, pdfData, blobUrl, publicationYear, journal, doi
    } = req.body;

    if (!title || !fileName) {
      return res.status(400).json({ error: 'Title and fileName are required' });
    }

    let finalBlobUrl = blobUrl;

    // If pdfData is provided (base64), upload it to Vercel Blob
    if (pdfData && !blobUrl) {
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
        filePath: finalBlobUrl,
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

// Notes routes
app.post('/api/notes', authenticateToken, async (req, res) => {
  try {
    const { content, paperId } = req.body;

    if (!content || !paperId) {
      return res.status(400).json({ error: 'Content and paperId are required' });
    }

    // Verify paper exists and belongs to user
    const paper = await prisma.paper.findFirst({
      where: { id: paperId, userId: req.user.userId }
    });

    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    const note = await prisma.note.create({
      data: {
        content,
        paperId,
        userId: req.user.userId
      }
    });

    res.status(201).json({ message: 'Note created successfully', note });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

app.get('/api/notes/:paperId', authenticateToken, async (req, res) => {
  try {
    const { paperId } = req.params;

    // Verify paper exists and belongs to user
    const paper = await prisma.paper.findFirst({
      where: { id: paperId, userId: req.user.userId }
    });

    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    const notes = await prisma.note.findMany({
      where: { paperId, userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ notes });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

app.put('/api/notes/:noteId', authenticateToken, async (req, res) => {
  try {
    const { noteId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const existingNote = await prisma.note.findFirst({
      where: { id: noteId, userId: req.user.userId }
    });

    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: { content }
    });

    res.json({ message: 'Note updated successfully', note: updatedNote });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

app.delete('/api/notes/:noteId', authenticateToken, async (req, res) => {
  try {
    const { noteId } = req.params;

    const existingNote = await prisma.note.findFirst({
      where: { id: noteId, userId: req.user.userId }
    });

    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await prisma.note.delete({ where: { id: noteId } });

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Failed to delete note' });
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

