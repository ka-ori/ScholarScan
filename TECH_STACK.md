# ScholarScan - Technical Stack

## Project Overview
ScholarScan is an AI-powered research paper management and analysis platform that helps researchers upload, organize, and extract insights from academic papers using advanced machine learning.

---

## Frontend Technologies

### Core Framework
- **React 18.2** - Modern JavaScript library for building user interfaces
- **Vite 5.0.8** - Next-generation frontend build tool for faster development

### Styling & UI
- **TailwindCSS 3.4.1** - Utility-first CSS framework for rapid UI development
- **Lucide React** - Beautiful, consistent icon library
- **React Hot Toast** - Elegant toast notifications

### Routing & State Management
- **React Router DOM 6.21.1** - Client-side routing and navigation
- **Zustand 4.4.7** - Lightweight state management solution

### PDF Processing
- **React PDF** - PDF rendering and display in browser
- **PDF.js** - Mozilla's PDF parsing library

### HTTP Client
- **Axios 1.6.5** - Promise-based HTTP client for API requests

---

## Backend Technologies

### Runtime & Framework
- **Node.js** - JavaScript runtime environment
- **Express.js 4.18.2** - Fast, minimalist web framework

### Database & ORM
- **PostgreSQL** - Robust relational database (hosted on Neon.tech)
- **Prisma ORM 5.7.1** - Next-generation TypeScript ORM
  - Type-safe database queries
  - Automatic migrations
  - Database introspection

### Authentication & Security
- **JSON Web Tokens (JWT)** - Secure token-based authentication
- **bcryptjs 2.4.3** - Password hashing and encryption
- **CORS** - Cross-Origin Resource Sharing middleware

### AI & Machine Learning
- **Google Gemini AI (Generative AI)** - Advanced LLM for:
  - Research paper summarization
  - Key insights extraction
  - Methodology analysis
  - Citation extraction
  - Abstract generation

### Validation
- **Zod 3.22.4** - TypeScript-first schema validation

### File Handling
- **Multer 1.4.5-lts.1** - Middleware for handling multipart/form-data (file uploads)

### Development Tools
- **Nodemon 3.0.2** - Auto-restart development server
- **Concurrently 8.2.2** - Run multiple commands simultaneously
- **dotenv 16.3.1** - Environment variable management

---

## Deployment & Infrastructure

### Hosting
- **Vercel** - Serverless deployment platform
  - Frontend hosting
  - Serverless API functions
  - Automatic CI/CD from Git
  - Edge network CDN

### Database Hosting
- **Neon.tech** - Serverless PostgreSQL
  - Auto-scaling
  - Instant branching
  - High availability
  - SSL connections

---

## Development Architecture

### Project Structure
```
ScholarScan/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── api/       # API client configuration
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/     # Page components
│   │   ├── store/     # State management
│   │   └── styles/    # Global styles
│   └── public/        # Static assets
│
├── backend/           # Express.js API (Local development)
│   ├── src/
│   │   ├── routes/    # API route handlers
│   │   ├── middleware/# Custom middleware
│   │   ├── config/    # Configuration files
│   │   └── utils/     # Utility functions
│   └── prisma/        # Database schema & migrations
│
└── api/              # Vercel serverless functions (Production)
    └── index.js      # Serverless API entry point
```

### API Architecture
- **RESTful API** design principles
- **JWT-based authentication** for secure endpoints
- **Middleware pipeline** for request processing
- **Error handling** with custom error middleware
- **CORS configuration** for cross-origin requests

---

## Key Features Implementation

### Authentication System
- User registration with email validation
- Secure password hashing (bcrypt, 10 salt rounds)
- JWT token generation (7-day expiration)
- Protected routes with token verification
- Automatic token refresh mechanism

### PDF Management
- Drag-and-drop file upload
- PDF preview with zoom controls
- Page navigation
- Text extraction and search
- Multi-file support (up to 10MB per file)

### AI Analysis Pipeline
1. **PDF Text Extraction** - Parse uploaded PDFs
2. **Content Processing** - Clean and structure text
3. **AI Analysis** - Send to Google Gemini AI
4. **Result Parsing** - Extract structured insights
5. **Storage** - Save to PostgreSQL database
6. **Display** - Present in user-friendly format

---

## Security Measures

- **Password Encryption** - bcrypt hashing with salt
- **JWT Authentication** - Secure token-based auth
- **Environment Variables** - Sensitive data protection
- **CORS Configuration** - Controlled cross-origin access
- **SQL Injection Prevention** - Prisma ORM parameterized queries
- **Input Validation** - Zod schema validation
- **File Type Validation** - PDF-only uploads
- **File Size Limits** - 10MB maximum

---

## Performance Optimizations

- **Vite Build Tool** - Lightning-fast HMR and builds
- **Code Splitting** - Lazy loading of routes
- **Asset Optimization** - Minification and compression
- **Database Indexing** - Optimized queries via Prisma
- **CDN Delivery** - Vercel edge network
- **Serverless Functions** - Auto-scaling backend

---

## Development Workflow

### Version Control
- **Git** - Distributed version control
- **GitHub** - Remote repository hosting
- **Branch Strategy** - Feature branches with main/production

### Environment Management
- **Development** - Local server (localhost:5001, localhost:5175)
- **Production** - Vercel deployment with environment variables

### Package Management
- **npm** - Node package manager
- **package.json** - Dependency management

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user (protected)

### Research Papers
- `POST /api/papers/upload` - Upload new paper
- `GET /api/papers` - List user's papers
- `GET /api/papers/:id` - Get specific paper details
- `DELETE /api/papers/:id` - Delete paper

### AI Analysis
- `POST /api/analyze` - Analyze uploaded paper with AI
- `GET /api/papers/:id/analysis` - Get AI analysis results

---

## Database Schema

### User Model
- id (UUID, Primary Key)
- email (String, Unique)
- password (String, Hashed)
- name (String)
- createdAt (DateTime)
- updatedAt (DateTime)

### Paper Model
- id (UUID, Primary Key)
- title (String)
- authors (String)
- pdfUrl (String)
- uploadDate (DateTime)
- userId (UUID, Foreign Key)
- analysis (JSON, nullable)

---

## Future Scalability

- **Microservices Architecture** - Separate services for different features
- **Redis Caching** - Fast data retrieval for frequent queries
- **WebSocket Support** - Real-time updates for analysis progress
- **Elasticsearch** - Advanced search capabilities
- **S3 Storage** - Scalable file storage solution
- **Docker Containers** - Consistent deployment environments

---

## Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Development Requirements

### System Requirements
- Node.js 18+ or 20+
- npm 9+
- PostgreSQL 14+ (or Neon.tech account)
- 4GB RAM minimum
- 10GB free disk space

### Environment Variables Required
```env
# Backend
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-key
PORT=5001

# Frontend
VITE_API_URL=http://localhost:5001
```

---

## License & Credits
- **License**: MIT (or specify your license)
- **AI Provider**: Google Gemini AI
- **Icons**: Lucide React
- **Database**: Neon.tech PostgreSQL
- **Deployment**: Vercel

---

## Contact & Repository
- **GitHub**: [ScholarScan Repository](https://github.com/ka-ori/ScholarScan)
- **Developer**: Krishna Devan
- **Project Type**: Academic Research Management Platform
