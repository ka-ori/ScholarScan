import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fileUpload from 'express-fileupload'
import { initializeRoutes } from './utils/routeLoader.js'
import { buildCorsConfig } from './utils/middlewareLoader.js'
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

const corsConfig = buildCorsConfig()
app.use(cors(corsConfig))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload())

initializeRoutes(app)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🎯 Milestone 1: JWT Authentication (Login + Signup)`);
});
