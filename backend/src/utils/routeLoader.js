import authRoutes from '../routes/auth.js'
import paperRoutes from '../routes/papers.js'
import userRoutes from '../routes/user.js'
import noteRoutes from '../routes/notes.js'

export const initializeRoutes = (app) => {
  app.get('/', (req, res) => {
    res.json({ message: 'ScholarScan API - Milestone 1: Authentication Only' })
  })

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Authentication service running' })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/papers', paperRoutes)
  app.use('/api/user', userRoutes)
  app.use('/api/notes', noteRoutes)
}

export const initializeMiddleware = (app, dependencies = {}) => {
  const { cors, express: expressLib, fileUpload } = dependencies

  if (cors) {
    app.use(cors({
      origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
      credentials: true
    }))
  }

  if (expressLib) {
    app.use(expressLib.json())
    app.use(expressLib.urlencoded({ extended: true }))
  }

  if (fileUpload) {
    app.use(fileUpload())
  }
}
