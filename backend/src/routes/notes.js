import express from 'express';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth.js';
import prisma from '../config/database.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// CREATE: Add a note to a paper (POST /api/notes)
router.post('/', async (req, res, next) => {
  try {
    const schema = z.object({
      content: z.string().min(1, "Note content cannot be empty"),
      paperId: z.string().uuid("Invalid paper ID")
    });

    const { content, paperId } = schema.parse(req.body);

    // Verify paper exists and belongs to user (or is accessible)
    const paper = await prisma.paper.findFirst({
      where: {
        id: paperId,
        userId: req.user.userId
      }
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
    next(error);
  }
});

// READ: Get all notes for a specific paper (GET /api/notes/:paperId)
router.get('/:paperId', async (req, res, next) => {
  try {
    const { paperId } = req.params;

    // Verify paper exists and belongs to user
    const paper = await prisma.paper.findFirst({
      where: {
        id: paperId,
        userId: req.user.userId
      }
    });

    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    const notes = await prisma.note.findMany({
      where: {
        paperId,
        userId: req.user.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ notes });
  } catch (error) {
    next(error);
  }
});

// UPDATE: Edit a note (PUT /api/notes/:noteId)
router.put('/:noteId', async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const schema = z.object({
      content: z.string().min(1, "Note content cannot be empty")
    });

    const { content } = schema.parse(req.body);

    // Verify note exists and belongs to user
    const existingNote = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId: req.user.userId
      }
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
    next(error);
  }
});

// DELETE: Delete a note (DELETE /api/notes/:noteId)
router.delete('/:noteId', async (req, res, next) => {
  try {
    const { noteId } = req.params;

    // Verify note exists and belongs to user
    const existingNote = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId: req.user.userId
      }
    });

    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await prisma.note.delete({
      where: { id: noteId }
    });

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
