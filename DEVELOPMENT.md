# ScholarScan - Development Guide

## Setup Instructions

### 1. Database Setup with Neon.tech

1. Go to [neon.tech](https://neon.tech) and create account
2. Create new project: "scholarscan-db"
3. Copy connection string
4. Add to `backend/.env`:
   ```
   DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/scholarscan?sslmode=require"
   ```

### 2. OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create API key
3. Add to `backend/.env`:
   ```
   OPENAI_API_KEY=sk-...
   ```

### 3. Running Migrations

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Development Workflow

```bash
# Start both servers
npm run dev

# Or separately:
# Terminal 1
cd backend && npm run dev

# Terminal 2  
cd frontend && npm run dev
```

## Deployment Guide

### Frontend (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Configure:
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-vercel-project.vercel.app/api
   ```
6. Deploy

### Backend (Vercel Serverless Functions)

1. Go to [vercel.com](https://vercel.com)
2. Create new project for backend
3. Deploy from GitHub repo
4. Configure with `vercel.backend.json`
5. Add environment variables:
   ```
   NODE_ENV=production
   DATABASE_URL=your-neon-connection-string
   JWT_SECRET=your-secret
   OPENAI_API_KEY=your-key
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
6. Deploy

## Testing

### Test Authentication

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

### Test Paper Upload

```bash
# Upload paper (replace TOKEN with your JWT)
curl -X POST http://localhost:5000/api/papers/upload \
  -H "Authorization: Bearer TOKEN" \
  -F "pdf=@/path/to/paper.pdf"
```

## Troubleshooting

### Database Connection Issues

- Ensure DATABASE_URL includes `?sslmode=require`
- Check Neon.tech dashboard for connection limits
- Try: `npx prisma db pull` to verify connection

### OpenAI API Errors

- Check API key is valid
- Ensure you have credits/billing enabled
- Test with smaller PDF files first

### File Upload Issues

- Check `backend/uploads/` directory exists
- Verify MAX_FILE_SIZE in .env
- Test with PDF under 10MB first

### CORS Errors

- Ensure FRONTEND_URL matches in backend .env
- Check frontend VITE_API_URL is correct
- Clear browser cache

## Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  papers    Paper[]
}

model Paper {
  id            String   @id @default(uuid())
  title         String
  authors       String?
  summary       String
  keywords      String[]
  category      String
  fileName      String
  userId        String
  user          User     @relation(...)
}
```

## Environment Variables Reference

### Backend
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for signing tokens
- `JWT_EXPIRES_IN` - Token expiration (default: 7d)
- `OPENAI_API_KEY` - OpenAI API key
- `MAX_FILE_SIZE` - Max upload size in bytes
- `UPLOAD_DIR` - Directory for uploaded files
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend
- `VITE_API_URL` - Backend API URL

## Common Commands

```bash
# Install dependencies
npm run install:all

# Run development
npm run dev

# Build frontend
cd frontend && npm run build

# Database commands
cd backend
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Create migration
npx prisma generate      # Generate client
npx prisma db push       # Push schema changes

# View logs
cd backend && npm run dev  # Watch logs

# Format code
npm run lint
```

## Architecture

```
User Browser
    ↓
React Frontend (Vercel)
    ↓
Express Backend (Vercel Serverless)
    ↓
    ├── PostgreSQL (Neon.tech)
    └── OpenAI API
```

## Features Checklist

- [x] JWT Authentication
- [x] User signup/login
- [x] PDF upload
- [x] PDF text extraction
- [x] AI summarization
- [x] Keyword extraction
- [x] Category classification
- [x] CRUD operations
- [x] Search functionality
- [x] Filter by category
- [x] Responsive UI
- [x] Error handling
- [x] Protected routes
- [x] Token refresh
- [x] File validation
- [x] Database migrations

## Next Steps

1. Add email verification
2. Implement password reset
3. Add paper sharing
4. Export papers to formats (PDF, DOCX)
5. Add citations management
6. Implement paper notes/annotations
7. Add collaborative features
8. Create mobile app
