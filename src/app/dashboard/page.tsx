import { requireAuth } from '@/lib/auth/utils'
import React from 'react'

export default async function page() {
   const user = await requireAuth()
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Welcome to the Dashboard, {user.name}!</h1>
      <p className="text-gray-400 mt-4">This is your dashboard where you can manage your projects, files, and settings.</p>
    </div>
  )
}
