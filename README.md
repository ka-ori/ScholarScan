# ScholarScan 🎓

AI-powered research paper analysis and summarization platform that helps students and researchers quickly understand academic papers.

![ScholarScan](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Deploy](https://img.shields.io/badge/deployed-vercel-black)

## 🚀 Quick Start

```bash
# Install all dependencies
npm run install:all

# Set up environment variables (see below)
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Run database migrations
cd backend && npm run prisma:generate && npm run prisma:migrate

# Start development servers
npm run dev
```

Visit `http://localhost:5173` to use the app!

## 🌟 Features

- **JWT-based Authentication** - Secure signup/login system
- **PDF Upload & Analysis** - Upload research papers in PDF format
- **AI Summarization** - Automatic generation of concise summaries using OpenAI GPT
- **Keyword Extraction** - AI-powered extraction of key terms and concepts
- **Smart Categorization** - Automatic classification by research domain
- **Search & Filter** - Find papers by title, authors, keywords, or category
- **CRUD Operations** - Full create, read, update, delete functionality
- **Responsive Dashboard** - Modern UI built with React and TailwindCSS
- **Cloud Deployment** - Ready for deployment on Vercel and Neon.tech

## 🛠️ Tech Stack

### Frontend
- React.js with Vite
- TailwindCSS for styling
- React Router for navigation
- Zustand for state management
- Axios for API calls

### Backend
- Node.js + Express.js
- Prisma ORM
- PostgreSQL (Neon.tech)
- JWT authentication
- OpenAI GPT API
- PDF parsing

### Deployment
- Frontend: Vercel
- Backend: Vercel (Serverless Functions)
- Database: Neon.tech

## 📁 Project Structure

```
scholarscan/
├── backend/           # Express.js API
│   ├── prisma/       # Database schema
│   ├── src/
│   │   ├── routes/   # API routes
│   │   ├── services/ # Business logic
│   │   └── middleware/
│   └── uploads/      # Uploaded PDFs
├── frontend/         # React app
│   └── src/
│       ├── pages/    # Route components
│       ├── components/
│       ├── store/    # Zustand stores
│       └── api/      # API client
└── package.json      # Root workspace config
```

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
JWT_SECRET=your-secret-key-change-in-production
OPENAI_API_KEY=sk-your-openai-api-key
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 📖 Documentation

- [Development Guide](./DEVELOPMENT.md) - Detailed setup and deployment instructions
- API Documentation - Available at `/api/docs` (coming soon)

## 🌐 Deployment

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed deployment instructions.

Quick deployment:
1. **Database**: Create on [Neon.tech](https://neon.tech)
2. **Backend**: Deploy to [Vercel.com](https://vercel.com) using serverless functions
3. **Frontend**: Deploy to [Vercel.com](https://vercel.com)

## 🤝 Contributing

Contributions welcome! Please read the contributing guidelines first.

## 📄 License

MIT License - see LICENSE file for details

## 👥 Author

Built for educational purposes as part of a full-stack development project.

---

**Note**: Remember to get API keys from OpenAI and set up your Neon.tech database before running!