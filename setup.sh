#!/bin/bash

# ScholarScan Setup Script
# This script helps you set up the development environment

echo "🎓 ScholarScan Setup Script"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js version: $(node --version)${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm version: $(npm --version)${NC}"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo ""

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend && npm install
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend && npm install
cd ..

echo ""
echo -e "${GREEN}✓ All dependencies installed!${NC}"
echo ""

# Setup environment files
echo "🔧 Setting up environment files..."
echo ""

# Backend .env
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo -e "${YELLOW}⚠️  Created backend/.env - Please update with your values:${NC}"
    echo "   - DATABASE_URL (Get from neon.tech)"
    echo "   - JWT_SECRET (Generate a random string)"
    echo "   - OPENAI_API_KEY (Get from platform.openai.com)"
else
    echo -e "${GREEN}✓ backend/.env already exists${NC}"
fi

# Frontend .env
if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo -e "${GREEN}✓ Created frontend/.env${NC}"
else
    echo -e "${GREEN}✓ frontend/.env already exists${NC}"
fi

echo ""
echo "📊 Database Setup"
echo ""
echo "Before running migrations, make sure you have:"
echo "1. Created a database on neon.tech"
echo "2. Updated DATABASE_URL in backend/.env"
echo ""
read -p "Have you set up the database? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Generating Prisma client..."
    cd backend
    npx prisma generate
    
    echo ""
    echo "Running database migrations..."
    npx prisma migrate dev --name init
    cd ..
    
    echo ""
    echo -e "${GREEN}✓ Database setup complete!${NC}"
else
    echo ""
    echo -e "${YELLOW}⚠️  Skipping database setup. Run these commands later:${NC}"
    echo "   cd backend"
    echo "   npx prisma generate"
    echo "   npx prisma migrate dev --name init"
fi

echo ""
echo "================================"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your credentials"
echo "2. Run: npm run dev (starts both frontend and backend)"
echo "3. Open: http://localhost:5173"
echo ""
echo "For detailed instructions, see DEVELOPMENT.md"
echo "================================"
