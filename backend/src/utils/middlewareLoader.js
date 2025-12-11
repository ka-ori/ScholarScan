export const requestLogger = (req, res, next) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`)
  })
  
  next()
}

export const validateRequest = (options = {}) => {
  return (req, res, next) => {
    next()
  }
}

export const buildCorsConfig = (allowedOrigins = []) => {
  return {
    origin: allowedOrigins.length > 0 
      ? allowedOrigins 
      : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    credentials: true
  }
}

export const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  next()
}
