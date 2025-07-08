import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db, users } from '@/lib/db'
import { eq } from 'drizzle-orm'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.redirect(new URL('/pricing?error=missing-session', request.url))
  }

  try {
    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'subscription'],
    })

    if (!session.customer || typeof session.customer === 'string') {
      return NextResponse.redirect(
        new URL('/pricing?error=invalid-session', request.url)
      )
    }

    const customerId = session.customer.id
    const subscriptionId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id

    if (!subscriptionId) {
      return NextResponse.redirect(
        new URL('/pricing?error=no-subscription', request.url)
      )
    }

    // Get the user from the session
    const userId = session.client_reference_id
    if (!userId) {
      return NextResponse.redirect(
        new URL('/pricing?error=no-user-id', request.url)
      )
    }

    // Verify user exists
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        email: true,
      },
    })

    if (!user) {
      return NextResponse.redirect(
        new URL('/pricing?error=user-not-found', request.url)
      )
    }

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.price.product'],
    })

    const price = subscription.items.data[0]?.price
    if (!price) {
      return NextResponse.redirect(
        new URL('/pricing?error=no-price', request.url)
      )
    }

    const productId = typeof price.product === 'string' ? price.product : price.product.id
    const productName = typeof price.product === 'string' 
      ? (await stripe.products.retrieve(price.product)).name
      : (price.product as Stripe.Product).name

    // Update user with subscription details
    const updatedUser = await db
      .update(users)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        stripeProductId: productId,
        planName: productName,
        subscriptionStatus: subscription.status,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning()

    if (!updatedUser.length) {
      return NextResponse.redirect(
        new URL('/pricing?error=update-failed', request.url)
      )
    }

    // Redirect to success page
    return NextResponse.redirect(new URL('/dashboard?success=subscription-created', request.url))
  } catch (error) {
    console.error('Error processing checkout success:', error)
    return NextResponse.redirect(
      new URL('/pricing?error=processing-failed', request.url)
    )
  }
}