import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SaaS Starter Template",
    template: "%s | SaaS Starter Template",
  },
  description: "A comprehensive SaaS starter template built with Next.js, TanStack Query, Stripe, better-auth, shadcn/ui, and Tailwind CSS",
  keywords: ["SaaS", "Next.js", "React", "TypeScript", "Tailwind CSS", "Stripe", "Authentication"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    title: "SaaS Starter Template",
    description: "A comprehensive SaaS starter template built with Next.js, TanStack Query, Stripe, better-auth, shadcn/ui, and Tailwind CSS",
    siteName: "SaaS Starter Template",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaS Starter Template",
    description: "A comprehensive SaaS starter template built with Next.js, TanStack Query, Stripe, better-auth, shadcn/ui, and Tailwind CSS",
    creator: "@yourusername",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
