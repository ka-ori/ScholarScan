import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth.js';
import { processPDF } from '../services/pdfService.js';
import { analyzePaper } from '../services/aiService.js';
import { uploadFile, deleteFile, isVercelBlobConfigured } from '../services/blobService.js';
import prisma from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// CREATE: Upload and process paper (POST /api/papers)
router.post('/', async (req, res, next) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const pdfFile = req.files.pdf;

    // Validate file type
    if (pdfFile.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files are allowed' });
    }

    console.log('Processing PDF:', pdfFile.name, 'Size:', pdfFile.size);

    // Extract text from PDF
    let pdfData;
    try {
      pdfData = await processPDF(pdfFile.data);
    } catch (pdfError) {
      console.error('PDF extraction failed:', pdfError.message);
      return res.status(400).json({
        error: pdfError.message || 'Could not extract text from PDF. The file may be scanned, encrypted, or corrupted.'
      });
    }

    const extractedText = pdfData.text;
    console.log('Extracted text length:', extractedText.length);
    console.log('Number of pages:', pdfData.numPages);

    // Use AI to analyze the paper (pass page count for better estimation)
    const analysis = await analyzePaper(extractedText, pdfData.numPages);

    // Save file to Vercel Blob or local storage
    let blobUrl = null;
    let filePath = null;

    if (isVercelBlobConfigured()) {
      // Upload to Vercel Blob
      try {
        const blob = await uploadFile(pdfFile.name, pdfFile.data, 'application/pdf');
        blobUrl = blob.url;
        filePath = blob.pathname;
        console.log('File uploaded to Vercel Blob:', blob.url);
      } catch (blobError) {
        console.error('Blob upload failed, falling back to local storage:', blobError.message);
        // Fall back to local storage
        const uploadDir = process.env.UPLOAD_DIR || './uploads';
        const fileName = `${Date.now()}-${pdfFile.name}`;
        filePath = fileName;
        await pdfFile.mv(path.join(uploadDir, fileName));
      }
    } else {
      // Use local storage
      const uploadDir = process.env.UPLOAD_DIR || './uploads';
      const fileName = `${Date.now()}-${pdfFile.name}`;
      filePath = fileName;
      await pdfFile.mv(path.join(uploadDir, fileName));
    }

    // Save to database (store keyFindings as part of summary for now)
    const summaryWithFindings = JSON.stringify({
      summary: analysis.summary,
      keyFindings: analysis.keyFindings || []
    });

    console.log('Creating paper with userId:', req.user.userId);
    console.log('User object:', req.user);

    const paper = await prisma.paper.create({
      data: {
        title: analysis.title,
        authors: analysis.authors,
        summary: summaryWithFindings,
        keywords: analysis.keywords,
        category: analysis.category,
        fileName: pdfFile.name,
        filePath: filePath,
        fileSize: pdfFile.size,
        fullText: extractedText.substring(0, 50000), // Store first 50k chars
        publicationYear: analysis.publicationYear,
        journal: analysis.journal,
        doi: analysis.doi,
        userId: req.user.userId,
        blobUrl: blobUrl // Store blob URL for cloud retrieval
      }
    });

    // Parse the summary back for response
    let parsedSummary;
    try {
      parsedSummary = JSON.parse(paper.summary);
    } catch {
      parsedSummary = { summary: paper.summary, keyFindings: [] };
    }

    res.status(201).json({
      message: 'Paper uploaded and analyzed successfully',
      paper: {
        ...paper,
        summary: parsedSummary.summary,
        keyFindings: parsedSummary.keyFindings
      }
    });
  } catch (error) {
    next(error);
  }
});

// READ: Get all papers for logged-in user with pagination (GET /api/papers)
router.get('/', async (req, res, next) => {
  try {
    const { 
      category, 
      search, 
      sortBy = 'uploadedAt', 
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = {
      userId: req.user.userId,
      ...(category && category !== 'All Categories' && { category }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { authors: { contains: search, mode: 'insensitive' } },
          { keywords: { hasSome: [search] } }
        ]
      })
    };

    // Get total count for pagination
    const totalCount = await prisma.paper.count({ where });

    const papers = await prisma.paper.findMany({
      where,
      orderBy: { [sortBy]: order },
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
    next(error);
  }
});

// Get single paper by ID
router.get('/:id', async (req, res, next) => {
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

    // Parse summary to extract keyFindings
    let parsedSummary;
    try {
      parsedSummary = JSON.parse(paper.summary);
    } catch {
      parsedSummary = { summary: paper.summary, keyFindings: [] };
    }

    res.json({ 
      paper: {
        ...paper,
        summaryText: parsedSummary.summary,
        keyFindings: parsedSummary.keyFindings || []
      }
    });
  } catch (error) {
    next(error);
  }
});

// Serve PDF file for viewing or return blob URL
router.get('/:id/pdf', async (req, res, next) => {
  try {
    const paper = await prisma.paper.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.userId
      },
      select: { filePath: true, fileName: true, blobUrl: true }
    });

    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    // If stored in Vercel Blob, return the blob URL
    if (paper.blobUrl) {
      return res.json({ url: paper.blobUrl });
    }

    // Otherwise serve from local storage
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const fullPath = path.join(uploadDir, paper.filePath);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${paper.fileName}"`);
    res.sendFile(path.resolve(fullPath));
  } catch (error) {
    next(error);
  }
});

// Update paper
router.put('/:id', async (req, res, next) => {
  try {
    const updateSchema = z.object({
      title: z.string().optional(),
      authors: z.string().optional(),
      summary: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      category: z.string().optional(),
      publicationYear: z.number().optional(),
      journal: z.string().optional(),
      doi: z.string().optional()
    });

    const data = updateSchema.parse(req.body);

    // Check ownership
    const existing = await prisma.paper.findFirst({
      where: { id: req.params.id, userId: req.user.userId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    const paper = await prisma.paper.update({
      where: { id: req.params.id },
      data
    });

    res.json({ message: 'Paper updated successfully', paper });
  } catch (error) {
    next(error);
  }
});

// Delete paper
router.delete('/:id', async (req, res, next) => {
  try {
    // Check ownership
    const existing = await prisma.paper.findFirst({
      where: { id: req.params.id, userId: req.user.userId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    await prisma.paper.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Paper deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Get statistics
router.get('/stats/summary', async (req, res, next) => {
  try {
    const totalPapers = await prisma.paper.count({
      where: { userId: req.user.userId }
    });

    const categoryCounts = await prisma.paper.groupBy({
      by: ['category'],
      where: { userId: req.user.userId },
      _count: true
    });

    res.json({
      totalPapers,
      categoryCounts: categoryCounts.map(c => ({
        category: c.category,
        count: c._count
      }))
    });
  } catch (error) {
    next(error);
  }
});

export default router;
