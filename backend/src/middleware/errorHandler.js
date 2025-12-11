export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'This email is already registered. Please try logging in instead.' })
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'User not found' })
  }

  if (err.code === 'P1002' || err.message?.includes('Can\'t reach database server')) {
    return res.status(500).json({ error: 'Database connection failed. Please try again in a moment.' })
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired. Please log in again.' })
  }

  if (err.name === 'ZodError') {
    const messages = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
    return res.status(400).json({ 
      error: `Validation failed: ${messages}`
    });
  }

  // Default error - sanitize message for production
  const statusCode = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(statusCode).json({
    error: isDevelopment ? (err.message || 'Internal server error') : 'Something went wrong. Please try again.',
    ...(isDevelopment && { stack: err.stack })
  });
};
