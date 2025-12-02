import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../config/database.js';

const router = express.Router();

// Validation schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Signup
router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, name } = signupSchema.parse(req.body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Log JWT token for development
    console.log('JWT Token Generated (Signup):');
    console.log('━'.repeat(80));
    console.log(token);
    console.log('━'.repeat(80));
    console.log(`New User: ${user.email}`);
    console.log(`User ID: ${user.id}`);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Log JWT token for development
    console.log('JWT Token Generated:');
    console.log('━'.repeat(80));
    console.log(token);
    console.log('━'.repeat(80));
    console.log(`User: ${user.email}`);
    console.log(`User ID: ${user.id}`);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
