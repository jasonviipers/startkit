import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { mcp, magicLink, organization, apiKey } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { stripe } from "@better-auth/stripe"
import { cookies } from "next/headers";
import { users, sessions, accounts, verifications } from "../db/schema";
import { db } from "../db";
import { sendMagicLinkEmail } from "../email/templates";
import { stripe as stripeClient } from "../stripe";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  account: {
    accountLinking: {
      trustedProviders: ['google', 'github'],
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      enabled: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 // 5 minutes
    },
    expiresIn: 60 * 60 * 24,// 24h
    updateAge: 60 * 30, // Refresh every 30 minutes
    freshAge: 60 * 5, // Refresh every 5 minutes
  },
  cookies: {
    get: async () => {
      const cookieStore = await cookies();
      return cookieStore.getAll();
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
      },
    },
  },
  rateLimit: {
    window: 10,// 10s
    max: 100, // 100 requests per 10s
    customRules: {
      '/api/auth/callback/github': {
        max: 5, // 5 requests per minute
        window: 60, // 1 minute
      },
      '/api/auth/callback/google': {
        max: 5, // 5 requests per minute
        window: 60, // 1 minute
      },
    },
  },
  baseURL: process.env.BETTER_AUTH_URL ?? '',
  secret: process.env.BETTER_AUTH_SECRET ?? '',
  plugins: [
    mcp({ loginPage: "/sign-in" }),
    apiKey(),
    organization(),
    nextCookies(),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        try {
          await sendMagicLinkEmail({ email, url });
        } catch (error) {
          console.error('Failed to send magic link email:', error);
          throw new Error('Failed to send magic link email');
        }
      }
    }),
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
    })
  ]
});

