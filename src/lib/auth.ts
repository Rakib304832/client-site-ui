import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const productionBaseURL = "https://client-site-ui.vercel.app";
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

const databaseUrl = process.env.MONGODB_URI;
const secret = process.env.BETTER_AUTH_SECRET;

// Next.js evaluates route modules while collecting build output. Fail fast at
// runtime if configuration is missing, but do not break `next build` itself.
if (!isBuildPhase && !databaseUrl) {
  throw new Error("MONGODB_URI is not configured");
}
if (!isBuildPhase && !secret) {
  throw new Error("BETTER_AUTH_SECRET is not configured");
}

const baseURL = process.env.BETTER_AUTH_URL ?? productionBaseURL;
const clientOrigins = (process.env.CLIENT_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Vercel exposes the current deployment and branch hosts. Trusting them keeps
// preview and deployment-specific URLs working, not just the production alias.
const vercelOrigins = [
  process.env.VERCEL_URL,
  process.env.VERCEL_BRANCH_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
]
  .filter((value): value is string => Boolean(value))
  .map((value) => (value.startsWith("http") ? value : `https://${value}`));

const trustedOrigins = [
  ...new Set([
    baseURL,
    "https://client-site-ui.vercel.app",
    "https://client-site-ui-rakib-299e.vercel.app",
    "https://client-site-ui-git-main-rakib-299e.vercel.app",
    "https://client-site-ui-git-*-rakib-299e.vercel.app",
    "https://client-site-*-rakib-299e.vercel.app",
    "https://client-site-607thl2rj-rakib-299e.vercel.app",
    ...vercelOrigins,
    ...clientOrigins,
  ]),
];

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const client = new MongoClient(
  databaseUrl ?? "mongodb://build-placeholder.invalid:27017/studio-space-build",
);

export const auth = betterAuth({
  database: mongodbAdapter(client.db()),
  secret: secret ?? "build-only-placeholder-secret",
  baseURL,
  trustedOrigins,
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  emailAndPassword: { enabled: true, minPasswordLength: 6 },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  ...(googleClientId && googleClientSecret
    ? {
        socialProviders: {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            redirectURI: `${baseURL}/api/auth/callback/google`,
          },
        },
      }
    : {}),
});
