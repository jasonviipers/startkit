import { PageHeader } from '@/components/layout/page-header'
import { requireAuth } from '@/lib/auth/utils'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: "Dashboard"
}
export default async function page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Hi, Welcome back 👋"
        description="Here's what's happening with your account today."
      />
    </div>
  )
}
