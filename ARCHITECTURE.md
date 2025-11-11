# ScholarScan Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                    http://localhost:5173                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (Vite)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Components: Navbar, Dashboard, Upload, PaperDetail      │  │
│  │  State: Zustand Store (Auth, Papers)                     │  │
│  │  Routing: React Router (Protected Routes)                │  │
│  │  Styling: TailwindCSS                                    │  │
│  │  API Client: Axios with Interceptors                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/REST API
                             │ /api/auth/* | /api/papers/*
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  EXPRESS.JS BACKEND SERVER                      │
│                    http://localhost:5000                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Middleware:                                              │  │
│  │   • CORS                                                  │  │
│  │   • JWT Authentication                                    │  │
│  │   • File Upload (express-fileupload)                     │  │
│  │   • Error Handler                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Routes:                                                  │  │
│  │   • /api/auth/signup                                      │  │
│  │   • /api/auth/login                                       │  │
│  │   • /api/papers/upload                                    │  │
│  │   • /api/papers (GET/PUT/DELETE)                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Services:                                                │  │
│  │   • pdfService.js (PDF text extraction)                  │  │
│  │   • aiService.js (OpenAI integration)                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────┬─────────────────────────┬──────────────────────┬─────────┘
       │                         │                      │
       ▼                         ▼                      ▼
┌─────────────┐      ┌──────────────────┐    ┌─────────────────┐
│  PostgreSQL │      │   OpenAI API     │    │  File System    │
│  (Neon.tech)│      │   GPT-4 Turbo    │    │   ./uploads/    │
│             │      │                  │    │                 │
│ • Users     │      │ • Summarization  │    │ • PDF files     │
│ • Papers    │      │ • Keywords       │    │ • Secure storage│
│             │      │ • Categorization │    │                 │
└─────────────┘      └──────────────────┘    └─────────────────┘
```

## Data Flow: Upload Paper

```
1. User selects PDF
   └─> Frontend validates (type, size)
       └─> POST /api/papers/upload with FormData
           └─> Backend JWT authentication
               └─> File saved to ./uploads/
                   └─> pdfService extracts text
                       └─> aiService analyzes with OpenAI
                           └─> Prisma saves to database
                               └─> Response sent to frontend
                                   └─> Navigate to paper detail
```

## Authentication Flow

```
┌────────┐           ┌─────────┐          ┌──────────┐
│  User  │           │ Frontend│          │  Backend │
└───┬────┘           └────┬────┘          └────┬─────┘
    │                     │                    │
    │  Enter credentials  │                    │
    ├────────────────────>│                    │
    │                     │  POST /api/auth/   │
    │                     │     login          │
    │                     ├───────────────────>│
    │                     │                    │
    │                     │  1. Find user      │
    │                     │  2. Verify password│
    │                     │  3. Generate JWT   │
    │                     │                    │
    │                     │  { token, user }   │
    │                     │<───────────────────┤
    │                     │                    │
    │   Store in Zustand  │                    │
    │   + localStorage    │                    │
    │                     │                    │
    │  Subsequent requests│                    │
    │  with Authorization:│                    │
    │  Bearer <token>     │                    │
    │                     ├───────────────────>│
    │                     │                    │
    │                     │  Verify JWT        │
    │                     │  Extract user      │
    │                     │  Process request   │
    │                     │                    │
```

## Database Schema

```
┌─────────────────────────────────────────┐
│               Users                     │
├─────────────────────────────────────────┤
│ id: uuid (PK)                          │
│ email: string (unique)                 │
│ password: string (hashed)              │
│ name: string                           │
│ createdAt: datetime                    │
│ updatedAt: datetime                    │
└──────────────┬──────────────────────────┘
               │ 1:N
               │
┌──────────────▼──────────────────────────┐
│               Papers                    │
├─────────────────────────────────────────┤
│ id: uuid (PK)                          │
│ title: string                          │
│ authors: string (nullable)             │
│ summary: text                          │
│ keywords: string[]                     │
│ category: string                       │
│ fileName: string                       │
│ filePath: string                       │
│ fileSize: integer                      │
│ fullText: text (nullable)              │
│ publicationYear: integer (nullable)    │
│ journal: string (nullable)             │
│ doi: string (nullable)                 │
│ userId: uuid (FK)                      │
│ uploadedAt: datetime                   │
│ updatedAt: datetime                    │
└─────────────────────────────────────────┘
```

## Component Hierarchy

```
App
├── Router
│   ├── PublicRoute
│   │   ├── Login
│   │   └── Signup
│   └── PrivateRoute
│       ├── Dashboard
│       │   ├── Stats Cards
│       │   ├── Search/Filter Bar
│       │   └── Papers Grid
│       │       └── Paper Card
│       ├── Upload
│       │   ├── Drag & Drop Zone
│       │   ├── File Preview
│       │   └── Upload Progress
│       └── PaperDetail
│           ├── Paper Metadata
│           ├── Edit Form
│           └── File Info
└── Navbar (persistent)
```

## API Endpoints

```
Authentication:
├── POST   /api/auth/signup      Create account
└── POST   /api/auth/login       Login

Papers (Protected):
├── POST   /api/papers/upload    Upload & analyze PDF
├── GET    /api/papers           List all papers (with filters)
├── GET    /api/papers/:id       Get single paper
├── PUT    /api/papers/:id       Update paper
├── DELETE /api/papers/:id       Delete paper
└── GET    /api/papers/stats/    Get statistics
            summary
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         INTERNET                            │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴──────────────┐
                ▼                            ▼
    ┌───────────────────┐         ┌──────────────────────┐
    │  Vercel (Frontend)│         │ Vercel (Backend API) │
    │                   │         │                      │
    │  • CDN           │         │  • Serverless Funcs  │
    │  • Auto Deploy   │         │  • Auto Deploy       │
    │  • SSL           │         │  • SSL               │
    └───────────────────┘         └────────┬─────────────┘
                                           │
                              ┌────────────┴──────────────┐
                              ▼                           ▼
                    ┌──────────────────┐      ┌─────────────────┐
                    │ Neon.tech        │      │  OpenAI API     │
                    │ PostgreSQL       │      │  GPT-4          │
                    │                  │      │                 │
                    │ • Serverless     │      │ • Global        │
                    │ • Auto-scaling   │      │ • Low latency   │
                    │ • SSL            │      │                 │
                    └──────────────────┘      └─────────────────┘
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  React, TailwindCSS, React Router, Lucide Icons            │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   STATE MANAGEMENT LAYER                    │
│  Zustand, React Context, Local Storage                     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      API/NETWORK LAYER                      │
│  Axios, HTTP Interceptors, REST                             │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                       │
│  Express.js, Middleware, Routes, Controllers                │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                   │
│  Services (AI, PDF Processing), Validation (Zod)            │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                     DATA ACCESS LAYER                       │
│  Prisma ORM, Database Queries                               │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                        DATA LAYER                           │
│  PostgreSQL Database (Neon.tech)                            │
└─────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY MEASURES                        │
├─────────────────────────────────────────────────────────────┤
│  Frontend:                                                  │
│   • HTTPS only in production                                │
│   • XSS protection (React escaping)                        │
│   • CSRF tokens (planned)                                   │
│   • Input validation                                        │
│                                                             │
│  Backend:                                                   │
│   • CORS configuration                                      │
│   • JWT authentication                                      │
│   • Password hashing (bcrypt)                              │
│   • SQL injection prevention (Prisma)                      │
│   • File type validation                                    │
│   • File size limits                                        │
│   • Rate limiting (planned)                                 │
│                                                             │
│  Database:                                                  │
│   • SSL connections                                         │
│   • Access control                                          │
│   • Encrypted at rest                                       │
│   • Regular backups                                         │
└─────────────────────────────────────────────────────────────┘
```

## File Storage Structure

```
backend/
└── uploads/
    ├── 1699000000000-paper1.pdf
    ├── 1699000001000-paper2.pdf
    └── 1699000002000-paper3.pdf

Note: Files are named with timestamp prefix to avoid conflicts
Each file is linked to a database record via the filePath field
```

## Environment Configuration

```
Development:
├── Frontend: http://localhost:5173
├── Backend: http://localhost:5000
├── Database: Neon.tech (same as production)
└── OpenAI: Production API

Production:
├── Frontend: https://scholarscan.vercel.app
├── Backend: https://scholarscan.vercel.app/api
├── Database: Neon.tech serverless PostgreSQL
└── OpenAI: Production API
```

This architecture provides:
- ✅ Scalability (serverless database, stateless backend)
- ✅ Security (JWT, HTTPS, input validation)
- ✅ Performance (CDN, database indexing)
- ✅ Maintainability (clean separation of concerns)
- ✅ Reliability (error handling, logging)
