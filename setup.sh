#!/bin/bash

echo "🐼 PANDA Lounge - Setup Script"
echo "================================"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your API keys"
    exit 1
fi

echo "✅ .env file found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Setup database
echo "🗄️  Setting up database..."
npx prisma db push

# Seed database
echo "🌱 Seeding database with test data..."
npm run prisma:seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the development server, run:"
echo "   npm run dev"
echo ""
echo "📖 Check SETUP_INSTRUCTIONS.md for Google OAuth setup"
echo ""
