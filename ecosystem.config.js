// Load .env file into process.env so PM2 can pass vars to Next.js
const path = require("path");
try {
  require("dotenv").config({ path: path.join(__dirname, ".env") });
} catch {
  // dotenv not available — env vars must be set in the system environment
}

module.exports = {
  apps: [
    {
      name: "cybershield-india",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: __dirname,           // absolute path — no ambiguity
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        // Pass all required env vars explicitly so PM2 injects them at runtime
        DATABASE_URL:                 process.env.DATABASE_URL,
        NEXTAUTH_SECRET:              process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL:                 process.env.NEXTAUTH_URL,
        RAZORPAY_KEY_ID:              process.env.RAZORPAY_KEY_ID,
        RAZORPAY_KEY_SECRET:          process.env.RAZORPAY_KEY_SECRET,
        NEXT_PUBLIC_RAZORPAY_KEY_ID:  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      },
    },
  ],
};
