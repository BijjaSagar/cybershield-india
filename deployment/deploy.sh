#!/bin/bash
# ============================================================
# CyberShield India — Hostinger VPS Deployment Script
# Run this on your Hostinger server to deploy/update the app
# ============================================================

set -e

APP_DIR="/var/www/cybershield-india"
REPO="https://github.com/BijjaSagar/cybershield-india.git"

echo "🚀 CyberShield India — Deploying..."

# ── First-time setup ──────────────────────────────────────────────────────────
if [ ! -d "$APP_DIR" ]; then
  echo "📥 Cloning repository..."
  git clone $REPO $APP_DIR
  cd $APP_DIR

  echo ""
  echo "⚠️  IMPORTANT: Create your .env file before running again:"
  echo "   nano $APP_DIR/.env"
  echo ""
  echo "   Paste these lines (fill in your actual values):"
  echo "   DATABASE_URL=postgresql://user:pass@host/db?sslmode=require"
  echo "   NEXTAUTH_SECRET=your-random-secret-min-32-chars"
  echo "   NEXTAUTH_URL=https://cybershieldindia.com"
  echo "   RAZORPAY_KEY_ID=rzp_live_xxx"
  echo "   RAZORPAY_KEY_SECRET=your_key_secret"
  echo "   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx"
  echo ""
  echo "   Then run this script again."
  exit 0
fi

# ── Update existing deployment ────────────────────────────────────────────────
cd $APP_DIR

# Verify .env exists
if [ ! -f ".env" ]; then
  echo "❌ ERROR: .env file not found at $APP_DIR/.env"
  echo "   Create it with your DATABASE_URL, NEXTAUTH_SECRET, etc."
  exit 1
fi

# Verify DATABASE_URL is set
source .env 2>/dev/null || true
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL is missing from .env"
  echo "   Add: DATABASE_URL=postgresql://..."
  exit 1
fi
echo "✅ .env verified — DATABASE_URL is set"

echo "📥 Pulling latest code..."
git pull origin main

echo "📦 Installing dependencies..."
npm install --production=false

echo "🧹 Clearing Next.js cache..."
rm -rf .next/cache

echo "🔨 Building app..."
npm run build

echo "🔄 Restarting with PM2..."
if pm2 list | grep -q "cybershield-india"; then
  pm2 restart cybershield-india --update-env
else
  pm2 start ecosystem.config.js
  pm2 save
fi

echo ""
echo "✅ Deployed! App running at http://localhost:3000"
echo "🌐 Make sure Nginx is configured to proxy cybershieldindia.com → port 3000"
echo "   See: deployment/nginx.conf"
