import { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  noIndex?: boolean
}

export function generateSEO({
  title,
  description,
  image,
  url,
  noIndex = false,
}: SEOProps = {}): Metadata {
  const siteTitle = 'SaaS Starter Template'
  const siteDescription = 'A comprehensive SaaS starter template built with Next.js, TanStack Query, Stripe, better-auth, shadcn/ui, and Tailwind CSS'
  const siteUrl = 'https://your-domain.com'
  const defaultImage = `${siteUrl}/og-image.jpg`

  const metadata: Metadata = {
    title: title ? `${title} | ${siteTitle}` : siteTitle,
    description: description || siteDescription,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: url || siteUrl,
      title: title || siteTitle,
      description: description || siteDescription,
      siteName: siteTitle,
      images: [
        {
          url: image || defaultImage,
          width: 1200,
          height: 630,
          alt: title || siteTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title || siteTitle,
      description: description || siteDescription,
      images: [image || defaultImage],
      creator: '@yourusername',
    },
  }

  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    }
  }

  return metadata
}

export function generateStructuredData(type: 'website' | 'organization' | 'article', data: Record<string, unknown>) {
  const baseData = {
    '@context': 'https://schema.org',
  }

  switch (type) {
    case 'website':
      return {
        ...baseData,
        '@type': 'WebSite',
        name: 'SaaS Starter Template',
        url: 'https://your-domain.com',
        description: 'A comprehensive SaaS starter template',
        ...data,
      }

    case 'organization':
      return {
        ...baseData,
        '@type': 'Organization',
        name: 'Your Company Name',
        url: 'https://your-domain.com',
        logo: 'https://your-domain.com/logo.png',
        ...data,
      }

    case 'article':
      return {
        ...baseData,
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        author: {
          '@type': 'Person',
          name: data.author || 'Your Name',
        },
        datePublished: data.publishedAt,
        dateModified: data.updatedAt || data.publishedAt,
        ...data,
      }

    default:
      return baseData
  }
}

