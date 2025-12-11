import express from 'express'
import { z } from 'zod'
import { authenticateToken } from '../middleware/auth.js'
import { parsePaginationParams, buildPaginationResponse } from '../utils/pagination.js'
import prisma from '../config/database.js'

const router = express.Router()

router.use(authenticateToken)

router.post('/', async (req, res, next) => {
  try {
    const schema = z.object({
      content: z.string().min(1, "Note content cannot be empty"),
      paperId: z.string().uuid("Invalid paper ID")
    })

    const { content, paperId } = schema.parse(req.body)

    const paper = await prisma.paper.findFirst({
      where: {
        id: paperId,
        userId: req.user.userId
      }
    })

    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' })
    }

    const note = await prisma.note.create({
      data: {
        content,
        paperId,
        userId: req.user.userId
      }
    })

    res.status(201).json({ message: 'Note created successfully', note })
  } catch (error) {
    next(error)
  }
})

router.get('/:paperId', async (req, res, next) => {
  try {
    const { paperId } = req.params
    const { page = 1, limit = 20 } = req.query

    const paper = await prisma.paper.findFirst({
      where: {
        id: paperId,
        userId: req.user.userId
      }
    })

    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' })
    }

    const { skip, limit: parsedLimit } = parsePaginationParams({ page, limit })

    const totalCount = await prisma.note.count({
      where: {
        paperId,
        userId: req.user.userId
      }
    })

    const notes = await prisma.note.findMany({
      where: {
        paperId,
        userId: req.user.userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: parsedLimit
    })

    const pagination = buildPaginationResponse(Number.parseInt(page), parsedLimit, totalCount)

    res.json({ notes, pagination })
  } catch (error) {
    next(error)
  }
})

router.put('/:noteId', async (req, res, next) => {
  try {
    const { noteId } = req.params
    const schema = z.object({
      content: z.string().min(1, "Note content cannot be empty")
    })

    const { content } = schema.parse(req.body)

    const existingNote = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId: req.user.userId
      }
    })

    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found' })
    }

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: { content }
    })

    res.json({ message: 'Note updated successfully', note: updatedNote })
  } catch (error) {
    next(error)
  }
})

router.delete('/:noteId', async (req, res, next) => {
  try {
    const { noteId } = req.params

    const existingNote = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId: req.user.userId
      }
    })

    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found' })
    }

    await prisma.note.delete({
      where: { id: noteId }
    })

    res.json({ message: 'Note deleted successfully' })
  } catch (error) {
    next(error)
  }
})

export default router
