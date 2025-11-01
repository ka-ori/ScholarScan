import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth.js';
import { processPDF } from '../services/pdfService.js';
import { analyzePaper } from '../services/aiService.js';
import prisma from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Upload and process paper
router.post('/upload', async (req, res, next) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const pdfFile = req.files.pdf;

    // Validate file type
    if (pdfFile.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files are allowed' });
    }

    // Extract text from PDF
    const extractedText = await processPDF(pdfFile.data);

    if (!extractedText || extractedText.trim().length < 100) {
      return res.status(400).json({ error: 'Could not extract sufficient text from PDF' });
    }

    // Use AI to analyze the paper
    const analysis = await analyzePaper(extractedText);

    // Save file
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const fileName = `${Date.now()}-${pdfFile.name}`;
    const filePath = path.join(uploadDir, fileName);
    
    await pdfFile.mv(filePath);

    // Save to database
    const paper = await prisma.paper.create({
      data: {
        title: analysis.title,
        authors: analysis.authors,
        summary: analysis.summary,
        keywords: analysis.keywords,
        category: analysis.category,
        fileName: pdfFile.name,
        filePath: fileName,
        fileSize: pdfFile.size,
        fullText: extractedText.substring(0, 50000), // Store first 50k chars
        publicationYear: analysis.publicationYear,
        journal: analysis.journal,
        doi: analysis.doi,
        userId: req.user.userId
      }
    });

    res.status(201).json({
      message: 'Paper uploaded and analyzed successfully',
      paper
    });
  } catch (error) {
    next(error);
  }
});

// Get all papers for logged-in user
router.get('/', async (req, res, next) => {
  try {
    const { category, search, sortBy = 'uploadedAt', order = 'desc' } = req.query;

    const where = {
      userId: req.user.userId,
      ...(category && { category }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { authors: { contains: search, mode: 'insensitive' } },
          { keywords: { hasSome: [search] } }
        ]
      })
    };

    const papers = await prisma.paper.findMany({
      where,
      orderBy: { [sortBy]: order },
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

    res.json({ papers, count: papers.length });
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

    res.json({ paper });
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
