import express from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth.js';
import prisma from '../config/database.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/user - Get current user profile
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
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      user: {
        ...user,
        paperCount: user._count.papers
      }
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/user - Update user profile
router.put('/', async (req, res, next) => {
  try {
    const updateSchema = z.object({
      name: z.string().min(2).optional(),
      email: z.string().email().optional()
    });

    const data = updateSchema.parse(req.body);

    // Check if email is being changed and if it's already taken
    if (data.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });
      if (existingUser && existingUser.id !== req.user.userId) {
        return res.status(409).json({ error: 'Email already in use' });
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
    });

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    next(error);
  }
});

// PUT /api/user/password - Change password
router.put('/password', async (req, res, next) => {
  console.log('=== Password change request received ===');
  console.log('Body:', req.body);
  console.log('User:', req.user);
  
  try {
    const passwordSchema = z.object({
      currentPassword: z.string(),
      newPassword: z.string().min(6)
    });

    const { currentPassword, newPassword } = passwordSchema.parse(req.body);
    console.log('Parsed passwords - currentPassword length:', currentPassword?.length);

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });
    
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('Found user:', user.email);

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    console.log('Password valid:', isValid);
    
    if (!isValid) {
      console.log('Returning 401 - incorrect password');
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.userId },
      data: { password: hashedPassword }
    });

    console.log('Password changed successfully');
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    next(error);
  }
});

// DELETE /api/user - Delete account
router.delete('/', async (req, res, next) => {
  try {
    // Delete all user's papers first (cascade should handle this but being explicit)
    await prisma.paper.deleteMany({
      where: { userId: req.user.userId }
    });

    // Delete user
    await prisma.user.delete({
      where: { id: req.user.userId }
    });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// GET /api/user/stats - Get user statistics
router.get('/stats', async (req, res, next) => {
  try {
    const totalPapers = await prisma.paper.count({
      where: { userId: req.user.userId }
    });

    const categoryCounts = await prisma.paper.groupBy({
      by: ['category'],
      where: { userId: req.user.userId },
      _count: true
    });

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
    });

    res.json({
      totalPapers,
      categoryCounts: categoryCounts.map(c => ({
        category: c.category,
        count: c._count
      })),
      recentPapers
    });
  } catch (error) {
    next(error);
  }
});

export default router;
