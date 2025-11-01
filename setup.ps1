# ScholarScan Setup Script for Windows
# Run with PowerShell

Write-Host "🎓 ScholarScan Setup Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✓ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
Write-Host ""

Write-Host "Installing root dependencies..."
npm install

Write-Host "Installing backend dependencies..."
Set-Location backend
npm install
Set-Location ..

Write-Host "Installing frontend dependencies..."
Set-Location frontend
npm install
Set-Location ..

Write-Host ""
Write-Host "✓ All dependencies installed!" -ForegroundColor Green
Write-Host ""

# Setup environment files
Write-Host "🔧 Setting up environment files..." -ForegroundColor Cyan
Write-Host ""

# Backend .env
if (!(Test-Path "backend/.env")) {
    Copy-Item "backend/.env.example" "backend/.env"
    Write-Host "⚠️  Created backend/.env - Please update with your values:" -ForegroundColor Yellow
    Write-Host "   - DATABASE_URL (Get from neon.tech)"
    Write-Host "   - JWT_SECRET (Generate a random string)"
    Write-Host "   - OPENAI_API_KEY (Get from platform.openai.com)"
} else {
    Write-Host "✓ backend/.env already exists" -ForegroundColor Green
}

# Frontend .env
if (!(Test-Path "frontend/.env")) {
    Copy-Item "frontend/.env.example" "frontend/.env"
    Write-Host "✓ Created frontend/.env" -ForegroundColor Green
} else {
    Write-Host "✓ frontend/.env already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "📊 Database Setup" -ForegroundColor Cyan
Write-Host ""
Write-Host "Before running migrations, make sure you have:"
Write-Host "1. Created a database on neon.tech"
Write-Host "2. Updated DATABASE_URL in backend/.env"
Write-Host ""

$response = Read-Host "Have you set up the database? (y/n)"

if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "Generating Prisma client..."
    Set-Location backend
    npx prisma generate
    
    Write-Host ""
    Write-Host "Running database migrations..."
    npx prisma migrate dev --name init
    Set-Location ..
    
    Write-Host ""
    Write-Host "✓ Database setup complete!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "⚠️  Skipping database setup. Run these commands later:" -ForegroundColor Yellow
    Write-Host "   cd backend"
    Write-Host "   npx prisma generate"
    Write-Host "   npx prisma migrate dev --name init"
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Update backend/.env with your credentials"
Write-Host "2. Run: npm run dev (starts both frontend and backend)"
Write-Host "3. Open: http://localhost:5173"
Write-Host ""
Write-Host "For detailed instructions, see DEVELOPMENT.md"
Write-Host "================================" -ForegroundColor Cyan
