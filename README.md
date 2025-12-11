# ScholarScan 🎓
## An AI-Powered Research Paper Summarizer and Organizer

![ScholarScan](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Deploy](https://img.shields.io/badge/deployed-vercel-black)

---

## � Problem Statement

With the exponential growth of scientific publications, students and researchers struggle to keep up with lengthy research papers. Finding relevant works, extracting key ideas, and organizing materials is time-consuming and inefficient.

**ScholarScan simplifies this process** by allowing users to:
- Upload research papers (PDFs)
- Automatically generate concise AI summaries
- Extract keywords and key concepts
- Categorize papers by research domain

This saves time, increases comprehension, and helps researchers focus on innovation instead of manual reading.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI framework
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

### Backend
- **Node.js + Express.js** - Server runtime and framework
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Relational database via Neon.tech
- **JWT** - Secure authentication

### AI Integration
- **Gemini GPT API** - For summarization, keyword extraction, and topic classification

### Deployment
- **Frontend** – Vercel
- **Backend** – Vercel (Serverless Functions)
- **Database** – Neon.tech (PostgreSQL)

---

## ✨ Key Features

### Authentication
- **Secure JWT-based login and signup**
- Password hashing with bcryptjs
- Protected API routes
- Token refresh handling

### PDF Processing
- **PDF Upload & Parsing** - Upload PDFs, extract raw text using Node.js parser
- File validation and secure storage
- Support for files up to 50MB

### AI-Powered Analysis
- **AI Summarization** - Use GPT API to generate concise summaries (3-4 sentences)
- **Keyword Extraction** - Automatically extract 5-7 relevant keywords
- **Automatic Categorization** - Classify papers into 16 research domains (AI, Physics, Medicine, Biology, etc.)
- **Publication Metadata Extraction** - Title, authors, publication date

### Paper Management
- **Dashboard** - Displays all user-uploaded papers with full CRUD support
- **Search, Sort, Filter, Pagination** - Manage large libraries of papers efficiently
- **Dynamic Routing** - Multiple pages for upload, view, edit, and settings
- **Responsive Design** - Fully mobile-friendly UI

---

## 👤 Demo Users

You can test ScholarScan with the following demo user accounts:

| Email | Password | Role |
|-------|----------|------|
| demo@scholarscan.com | demo123 | General User |
| student@scholarscan.com | demo123 | Student |
| researcher@scholarscan.com | demo123 | Researcher |

To seed the database with demo users, run:
```bash
cd backend
npm run seed
```

---

## 📊 CRUD Using APIs and Database

ScholarScan implements complete CRUD operations through RESTful APIs:

| Operation | Description | Example Endpoint |
|-----------|-------------|------------------|
| **Create** | Upload a new research paper with title, authors, summary, keywords, and category | `POST /api/papers` |
| **Read** | Fetch all or specific papers belonging to a user | `GET /api/papers` or `GET /api/papers/:id` |
| **Update** | Edit paper details (e.g., title, notes, category) | `PUT /api/papers/:id` |
| **Delete** | Remove a paper from the database | `DELETE /api/papers/:id` |

---

## 🔍 Searching, Sorting, Filtering, and Pagination

These features enhance data accessibility and user experience:

| Function | Implementation | Use Case |
|----------|-----------------|----------|
| **Search** | Search papers by title, author name, or keywords (SQL LIKE query or full-text search) | Quickly locate a paper titled "Quantum Optimization" |
| **Sort** | Sort by upload date, title, or domain | View most recent uploads first |
| **Filter** | Filter by research domain (AI, Biology, Physics) or by keyword tags | Show only "AI" related papers |
| **Pagination** | Backend-based pagination using LIMIT and OFFSET in SQL queries | Efficiently browse large paper libraries page-by-page |

These are implemented on the **Dashboard** and **All Papers** pages, allowing users to manage hundreds of uploaded papers smoothly.

---

## 🗺️ Routing and Pages

| Page | Description | Dynamic Data |
|------|-------------|--------------|
| **Landing Page** | Introduces ScholarScan, includes login/signup links | Static |
| **Signup / Login Page** | JWT-based authentication system | Auth API |
| **Dashboard Page** | Displays uploaded papers with search, sort, filter, and pagination features | Fetches data dynamically from backend |
| **Upload Page** | Allows users to upload a PDF; triggers summarization and saves data to DB | Fetches AI-generated summary, posts data |
| **Paper Details Page** | Shows full summary, keywords, category, and user notes | Fetches by paperId dynamically |
| **Edit Page** | Allows editing metadata, category, or notes for a paper | Prefilled form fetched from DB |
| **Profile / Settings Page** | Manages user info and preferences | Fetches user data dynamically |

Routing is handled through **React Router**, with clean navigation between pages.

---

## 📡 Dynamic Fetching of Data

The frontend dynamically retrieves data from backend APIs using:
- **Axios** - HTTP client library
- **Real-time updates** after CRUD operations (e.g., when a paper is deleted, the dashboard refreshes automatically)
- Most pages (Dashboard, Paper Details, Edit, Profile) fetch live data from the database using REST APIs

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- npm or yarn
- Gemini API key
- Neon.tech PostgreSQL database

### Installation

```bash
# Clone the repository
git clone https://github.com/ka-ori/ScholarScan.git
cd ScholarScan

# Install all dependencies
npm run install:all

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit these files with your credentials

# Setup database
cd backend
npx prisma generate
npx prisma migrate dev --name init

# Run the app
cd ..
npm run dev
```

### Using Setup Script

```bash
# macOS/Linux
./setup.sh

# Windows PowerShell
.\setup.ps1
```

---

## 🔑 Required Credentials

Before running, you need:

### 1. Neon.tech Account (Free)
- Sign up at [neon.tech](https://neon.tech)
- Create a PostgreSQL database
- Copy the connection string to `backend/.env`

### 2. OpenAI API Key (Paid)
- Sign up at [platform.openai.com](https://platform.openai.com)
- Enable billing
- Create an API key
- Costs approximately $0.01-0.10 per paper analysis

---

## � Performance Notes

- **PDF Upload:** < 1 second (depends on file size)
- **AI Analysis:** 10-30 seconds per paper
- **Database Queries:** < 100ms average
- **Page Load:** < 1 second

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Protected API routes
- ✅ CORS configuration
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection
- ✅ File type validation
- ✅ File size limits

---

## � Future Enhancements

- [ ] Multilingual Summarization (support for non-English papers)
- [ ] Citation Extraction for bibliography management
- [ ] PDF Annotation & Highlighting (in-browser)
- [ ] Recommendation System (suggest related papers using semantic similarity)
- [ ] Integration with Google Scholar / arXiv APIs for direct imports
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Paper sharing between users
- [ ] Export to PDF/DOCX
- [ ] Collaborative features
- [ ] Mobile app version
- [ ] Alternative AI providers (Gemini, Claude)
- [ ] Batch upload
- [ ] Paper annotations

---

## 📚 Expected Outcome

ScholarScan will streamline the research process by:

1. **Enabling users to upload, summarize, and organize papers efficiently**
2. **Making research content more accessible and searchable**
3. **Demonstrating the integration of AI, databases, and modern web development** for a real-world use case
4. **Ultimately empowering students and researchers** to save time, increase productivity, and focus on discovery rather than data management

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 👥 Author

Built as a full-stack development project demonstrating modern web technologies and AI integration.

---

**Ready to transform how you manage research? Get started with ScholarScan today!** 🚀
