import express from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { authenticateToken } from '../middleware/auth.js'
import { parsePaginationParams, buildPaginationResponse } from '../utils/pagination.js'
import prisma from '../config/database.js'

const router = express.Router()

router.use(authenticateToken)

router.get('/', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { papers: true }
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ 
      user: {
        ...user,
        paperCount: user._count.papers
      }
    })
  } catch (error) {
    next(error)
  }
})

router.put('/', async (req, res, next) => {
  try {
    const updateSchema = z.object({
      name: z.string().min(2).optional(),
      email: z.string().email().optional()
    })

    const data = updateSchema.parse(req.body)

    if (data.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      })
      if (existingUser && existingUser.id !== req.user.userId) {
        return res.status(409).json({ error: 'Email already in use' })
      }
    }

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true
      }
    })

    res.json({ message: 'Profile updated successfully', user })
  } catch (error) {
    next(error)
  }
})

router.put('/password', async (req, res, next) => {
  try {
    const passwordSchema = z.object({
      currentPassword: z.string(),
      newPassword: z.string().min(6)
    })

    const { currentPassword, newPassword } = passwordSchema.parse(req.body)

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const isValid = await bcrypt.compare(currentPassword, user.password)
    
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: req.user.userId },
      data: { password: hashedPassword }
    })

    res.json({ message: 'Password changed successfully' })
  } catch (error) {
    next(error)
  }
})

router.delete('/', async (req, res, next) => {
  try {
    await prisma.paper.deleteMany({
      where: { userId: req.user.userId }
    })

    await prisma.user.delete({
      where: { id: req.user.userId }
    })

    res.json({ message: 'Account deleted successfully' })
  } catch (error) {
    next(error)
  }
})

router.get('/papers', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', category = '', sortBy = 'uploadedAt', order = 'desc' } = req.query

    const { skip, limit: parsedLimit } = parsePaginationParams({ page, limit })

    const where = {
      userId: req.user.userId,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { authors: { contains: search, mode: 'insensitive' } },
          { keywords: { hasSome: [search] } }
        ]
      }),
      ...(category && category !== 'All' && { category })
    }

    const totalCount = await prisma.paper.count({ where })

    const papers = await prisma.paper.findMany({
      where,
      orderBy: { [sortBy]: order },
      skip,
      take: parsedLimit,
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
    })

    const pagination = buildPaginationResponse(Number.parseInt(page), parsedLimit, totalCount)

    res.json({ papers, pagination })
  } catch (error) {
    next(error)
  }
})

router.get('/stats', async (req, res, next) => {
  try {
    const totalPapers = await prisma.paper.count({
      where: { userId: req.user.userId }
    })

    const categoryCounts = await prisma.paper.groupBy({
      by: ['category'],
      where: { userId: req.user.userId },
      _count: true
    })

    const recentPapers = await prisma.paper.findMany({
      where: { userId: req.user.userId },
      orderBy: { uploadedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        category: true,
        uploadedAt: true
      }
    })

    res.json({
      totalPapers,
      categoryCounts: categoryCounts.map(c => ({
        category: c.category,
        count: c._count
      })),
      recentPapers
    })
  } catch (error) {
    next(error)
  }
})

export default router
