import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const databaseUrl = process.env.MONGODB_URI as string;
const secret = process.env.BETTER_AUTH_SECRET as string;
const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
const clientOrigins = (process.env.CLIENT_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!databaseUrl) throw new Error("MONGODB_URI missing in .env");
if (!secret) throw new Error("BETTER_AUTH_SECRET missing in .env");
if (!googleClientId || !googleClientSecret) {
  throw new Error("GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET missing in .env");
}

const client = new MongoClient(databaseUrl);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret,
  baseURL,
  trustedOrigins: [...new Set([baseURL, ...clientOrigins])],
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
  socialProviders: {
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      redirectURI: baseURL + "/api/auth/callback/google",
    },
  },
});