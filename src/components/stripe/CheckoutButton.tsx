'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface CheckoutButtonProps {
  priceId: string
  userId?: string
  children: React.ReactNode
}

export default function CheckoutButton({ priceId, userId, children }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
        }),
      })

      const { sessionId } = await response.json()

      if (sessionId) {
        // Redirect to Stripe Checkout
        const stripe = (await import('@stripe/stripe-js')).loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
        )
        
        const stripeInstance = await stripe
        await stripeInstance?.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      className="w-full"
    >
      {isLoading ? 'Loading...' : children}
    </Button>
  )
}

