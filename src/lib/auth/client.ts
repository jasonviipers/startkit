import { createAuthClient } from "better-auth/react";
import { passkeyClient, magicLinkClient } from "better-auth/client/plugins";
import { stripeClient } from "@better-auth/stripe/client"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "",
  plugins: [passkeyClient(), magicLinkClient(),
  stripeClient({
    subscription: false //if you want to enable subscription management
  })
  ],

});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;

