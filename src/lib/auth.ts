import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const databaseUrl = process.env.MONGODB_URI;
if (!databaseUrl) throw new Error("MONGODB_URI is not configured");

const secret = process.env.BETTER_AUTH_SECRET;
if (!secret) throw new Error("BETTER_AUTH_SECRET is not configured");

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (Boolean(googleClientId) !== Boolean(googleClientSecret)) {
  throw new Error("Both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured");
}

const client = new MongoClient(databaseUrl);
const db = client.db();

const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret,
  baseURL,
  trustedOrigins: [baseURL, "http://localhost:3001"],
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
          },
        },
      }
    : {}),
});
