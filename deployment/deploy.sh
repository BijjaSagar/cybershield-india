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
  echo "⚠️  Create your .env file now:"
  echo "   cp .env.example .env && nano .env"
  echo "   Fill in your DATABASE_URL, NEXTAUTH_SECRET, RAZORPAY keys"
  echo "   Then run this script again."
  exit 0
fi

# ── Update existing deployment ────────────────────────────────────────────────
cd $APP_DIR

echo "📥 Pulling latest code..."
git pull origin main

echo "📦 Installing dependencies..."
npm install --production=false

echo "🔨 Building app..."
npm run build

echo "🔄 Restarting with PM2..."
if pm2 list | grep -q "cybershield-india"; then
  pm2 restart cybershield-india
else
  pm2 start ecosystem.config.js
  pm2 save
fi

echo ""
echo "✅ Deployed! App running at http://localhost:3000"
echo "🌐 Make sure Nginx is configured to proxy cybershieldindia.com → port 3000"
echo "   See: deployment/nginx.conf"
