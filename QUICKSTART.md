# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd ScholarScan

# Run the setup script (macOS/Linux)
chmod +x setup.sh
./setup.sh

# OR on Windows (PowerShell)
.\setup.ps1

# OR manually
npm run install:all
```

### Step 2: Get API Keys

#### Neon.tech Database
1. Go to [neon.tech](https://neon.tech)
2. Sign up/login
3. Create new project: "scholarscan"
4. Copy the connection string

#### OpenAI API
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create account
3. Go to API Keys
4. Create new key
5. Copy the key

### Step 3: Configure Environment

Update `backend/.env`:

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/scholarscan?sslmode=require"
JWT_SECRET="your-random-secret-string-here"
OPENAI_API_KEY="sk-your-key-here"
```

### Step 4: Setup Database

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
cd ..
```

### Step 5: Run the App

```bash
npm run dev
```

Visit: http://localhost:5173

## 🎯 What You'll See

1. **Login/Signup Page** - Create your account
2. **Dashboard** - View all your papers
3. **Upload Page** - Upload a PDF research paper
4. **AI Analysis** - Watch it analyze and categorize
5. **Paper Details** - View summary, keywords, and more!

## 🧪 Test with Sample PDF

Don't have a research paper? Download one from:
- [arXiv.org](https://arxiv.org)
- [Google Scholar](https://scholar.google.com)
- [ResearchGate](https://researchgate.net)

## 🐛 Troubleshooting

### "Database connection failed"
- Check DATABASE_URL has `?sslmode=require`
- Verify Neon.tech database is active

### "OpenAI API error"
- Verify API key is correct
- Check you have credits/billing enabled

### "Port already in use"
- Change PORT in backend/.env
- Kill process on port 5000: `lsof -ti:5000 | xargs kill`

### "Module not found"
- Run `npm run install:all` again
- Delete node_modules and reinstall

## 📚 Learn More

- [Full Documentation](./README.md)
- [Development Guide](./DEVELOPMENT.md)
- [API Reference](./API.md) (coming soon)

## 💡 Tips

- Start with small PDFs (< 5MB) for faster processing
- The AI takes 10-30 seconds to analyze a paper
- You can edit any field after upload
- Use filters to organize your papers

## 🎓 Features to Try

1. Upload multiple papers
2. Search by keywords
3. Filter by category
4. Edit paper details
5. View statistics on dashboard

---

Need help? Open an issue on GitHub!
