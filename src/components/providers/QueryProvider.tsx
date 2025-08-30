'use client'

import { useRouter } from 'next/navigation'
import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Link from "next/link"
import { ThemeProvider } from './theme-provider'
import { useState } from 'react'
import { Toaster } from '../ui/sonner'
import { queryClient } from '@/lib/queryClient'
import { authClient } from '@/lib/auth/client'

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [client] = useState(() => queryClient);
  const router = useRouter()

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      credentials={false}
      magicLink={true}
      passkey={true}
      onSessionChange={() => {
        router.refresh()
      }}
      Link={Link}
      social={{
        providers: ["github", "google"]
      }}
       localization={{
        SIGN_IN: "Welcome to App",
        EMAIL_PLACEHOLDER: "m@example.com",
        MAGIC_LINK: "Sign in with Magic Link",
        PASSKEY: "Sign in with Passkey",
        OR_CONTINUE_WITH: "Or continue with",
      
      }}
      
    >
      <QueryClientProvider client={client}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthUIProvider>
  )
}

