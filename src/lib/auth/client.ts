import { createAuthClient } from "better-auth/react";
import { passkeyClient, magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "",
  plugins: [passkeyClient(), magicLinkClient(),],

});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;

