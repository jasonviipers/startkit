'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from './theme-provider'
import { useState } from 'react'
import { Toaster } from '../ui/sonner'
import { queryClient } from '@/lib/queryClient'

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [client] = useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
        <Toaster />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

