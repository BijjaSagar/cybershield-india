/**
 * db-push.mjs
 * Pushes the CyberShield India schema to NeonDB.
 * Works even when local ISP DNS blocks neon.tech — connects via resolved IP with SNI.
 * Usage: node scripts/db-push.mjs
 */

import pg from "pg";
const { Client } = pg;

const client = new Client({
  host: "35.173.20.131",       // Resolved IP of NeonDB endpoint
  port: 5432,
  database: "neondb",
  user: "neondb_owner",
  password: "npg_Qbnz9OsG1TaP",
  ssl: {
    rejectUnauthorized: false,
    servername: "ep-late-night-anvf4kn3-pooler.c-6.us-east-1.aws.neon.tech",
  },
  connectionTimeoutMillis: 20000,
});

const SQL = `
-- ─── Enums ───────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('OWNER', 'ADMIN', 'VIEWER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "Plan" AS ENUM ('KAVACH', 'SURAKSHA', 'RAKSHAK');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "ThreatSeverity" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "ThreatStatus" AS ENUM ('ACTIVE', 'INVESTIGATING', 'MITIGATED', 'FALSE_POSITIVE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'INVESTIGATING', 'CONTAINED', 'RESOLVED', 'CLOSED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "LogType" AS ENUM ('AUTH', 'NETWORK', 'SYSTEM', 'APPLICATION', 'ENDPOINT', 'CLOUD');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "VulnStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'PATCHED', 'ACCEPTED_RISK');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "ComplianceStatus" AS ENUM ('COMPLIANT', 'PARTIAL', 'NON_COMPLIANT', 'NOT_STARTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'CAPTURED', 'FAILED', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── Organization ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Organization" (
  "id"                 TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name"               TEXT NOT NULL,
  "plan"               "Plan" NOT NULL DEFAULT 'SURAKSHA',
  "employeeCount"      INTEGER NOT NULL DEFAULT 10,
  "industry"           TEXT,
  "gstNumber"          TEXT,
  "nodalOfficer"       TEXT,
  "nodalEmail"         TEXT,
  "nodalPhone"         TEXT,
  "certInId"           TEXT,
  "dataLocality"       TEXT NOT NULL DEFAULT 'India',
  "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "subscriptionId"     TEXT,
  "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'TRIAL',
  "trialEndsAt"        TIMESTAMP(3),
  "currentPeriodEnd"   TIMESTAMP(3)
);

-- ─── User ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "User" (
  "id"            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name"          TEXT NOT NULL,
  "email"         TEXT NOT NULL UNIQUE,
  "emailVerified" TIMESTAMP(3),
  "password"      TEXT NOT NULL,
  "phone"         TEXT,
  "image"         TEXT,
  "role"          "Role" NOT NULL DEFAULT 'ADMIN',
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "orgId"         TEXT REFERENCES "Organization"("id") ON DELETE SET NULL
);

-- ─── Account (NextAuth OAuth) ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Account" (
  "id"                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId"            TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "type"              TEXT NOT NULL,
  "provider"          TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token"     TEXT,
  "access_token"      TEXT,
  "expires_at"        INTEGER,
  "token_type"        TEXT,
  "scope"             TEXT,
  "id_token"          TEXT,
  "session_state"     TEXT,
  UNIQUE("provider", "providerAccountId")
);

-- ─── Session (NextAuth) ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Session" (
  "id"           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId"       TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "expires"      TIMESTAMP(3) NOT NULL
);

-- ─── VerificationToken (NextAuth) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token"      TEXT NOT NULL UNIQUE,
  "expires"    TIMESTAMP(3) NOT NULL,
  UNIQUE("identifier", "token")
);

-- ─── Threat ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Threat" (
  "id"          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orgId"       TEXT NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
  "type"        TEXT NOT NULL,
  "severity"    "ThreatSeverity" NOT NULL,
  "source"      TEXT NOT NULL,
  "target"      TEXT,
  "status"      "ThreatStatus" NOT NULL DEFAULT 'ACTIVE',
  "description" TEXT,
  "rawLog"      TEXT,
  "detectedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolvedAt"  TIMESTAMP(3),
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Threat_orgId_detectedAt_idx" ON "Threat"("orgId", "detectedAt");

-- ─── Incident ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Incident" (
  "id"               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orgId"            TEXT NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
  "title"            TEXT NOT NULL,
  "severity"         "ThreatSeverity" NOT NULL,
  "status"           "IncidentStatus" NOT NULL DEFAULT 'OPEN',
  "description"      TEXT,
  "affectedSystems"  TEXT[] DEFAULT '{}',
  "certInReported"   BOOLEAN NOT NULL DEFAULT false,
  "certInReportedAt" TIMESTAMP(3),
  "certInDeadline"   TIMESTAMP(3),
  "detectedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolvedAt"       TIMESTAMP(3),
  "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Incident_orgId_detectedAt_idx" ON "Incident"("orgId", "detectedAt");

-- ─── LogEntry ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "LogEntry" (
  "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orgId"     TEXT NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
  "source"    TEXT NOT NULL,
  "type"      "LogType" NOT NULL,
  "severity"  "ThreatSeverity" NOT NULL,
  "message"   TEXT NOT NULL,
  "ipAddress" TEXT,
  "userId"    TEXT,
  "rawData"   TEXT,
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "LogEntry_orgId_timestamp_idx" ON "LogEntry"("orgId", "timestamp");

-- ─── Vulnerability ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Vulnerability" (
  "id"           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orgId"        TEXT NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
  "cveId"        TEXT,
  "title"        TEXT NOT NULL,
  "severity"     "ThreatSeverity" NOT NULL,
  "asset"        TEXT NOT NULL,
  "cvssScore"    DOUBLE PRECISION,
  "description"  TEXT,
  "remediation"  TEXT,
  "status"       "VulnStatus" NOT NULL DEFAULT 'OPEN',
  "discoveredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "patchedAt"    TIMESTAMP(3)
);
CREATE INDEX IF NOT EXISTS "Vulnerability_orgId_idx" ON "Vulnerability"("orgId");

-- ─── TrainingProgress ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "TrainingProgress" (
  "id"            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orgId"         TEXT NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
  "employeeEmail" TEXT NOT NULL,
  "employeeName"  TEXT NOT NULL,
  "moduleId"      TEXT NOT NULL,
  "moduleName"    TEXT NOT NULL,
  "completed"     BOOLEAN NOT NULL DEFAULT false,
  "score"         INTEGER,
  "completedAt"   TIMESTAMP(3),
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─── ComplianceItem ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "ComplianceItem" (
  "id"          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orgId"       TEXT NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
  "framework"   TEXT NOT NULL,
  "controlId"   TEXT NOT NULL,
  "controlName" TEXT NOT NULL,
  "status"      "ComplianceStatus" NOT NULL DEFAULT 'NOT_STARTED',
  "evidence"    TEXT,
  "notes"       TEXT,
  "dueDate"     TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("orgId", "framework", "controlId")
);

-- ─── Payment ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Payment" (
  "id"                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orgId"             TEXT NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
  "razorpayOrderId"   TEXT NOT NULL UNIQUE,
  "razorpayPaymentId" TEXT,
  "razorpaySignature" TEXT,
  "amount"            INTEGER NOT NULL,
  "currency"          TEXT NOT NULL DEFAULT 'INR',
  "plan"              "Plan" NOT NULL,
  "status"            "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

async function main() {
  console.log("🔌 Connecting to NeonDB...");
  await client.connect();
  console.log("✅ Connected!");

  console.log("🏗️  Creating tables...");
  await client.query(SQL);
  console.log("✅ All tables created successfully!");

  // Verify tables
  const res = await client.query(`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename
  `);
  console.log("\n📋 Tables in database:");
  res.rows.forEach((r) => console.log("  •", r.tablename));

  await client.end();
  console.log("\n🚀 Database is ready! You can now run the app.");
}

main().catch((err) => {
  console.error("❌ Migration failed:", err.message);
  process.exit(1);
});
