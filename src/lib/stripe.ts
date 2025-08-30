import Stripe from 'stripe'
import { getStripeCustomerId, updateSubscription } from './db/queries'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
  typescript: true,
})

export const getStripe = () => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set')
  }

  return new Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
}


export async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  const subscriptionId = subscription.id
  const status = subscription.status

  try {
    const customer = await getStripeCustomerId(customerId)
    if (!customer) {
      console.error(`Customer not found for Stripe customer: ${customerId}`)
      return
    }

    if (status === 'active' || status === 'trialing') {
      const price = subscription.items.data[0]?.price
      if (!price) {
        console.error('No price found for subscription:', subscriptionId)
        return
      }

      let productName = 'Unknown Product'
      if (typeof price.product === 'object' && (price.product as Stripe.Product).name) {
        productName = (price.product as Stripe.Product).name;
      } else if (typeof price.product === 'string') {
        // Fetch product details if we only have the ID
        const product = await stripe.products.retrieve(price.product)
        productName = product.name
      }

      await updateSubscription(customerId, {
        stripeSubscriptionId: subscriptionId,
        stripeProductId: typeof price.product === 'string' ? price.product : price.product.id,
        planName: productName,
        subscriptionStatus: status,
      })
    } else if (status === 'canceled' || status === 'unpaid' || status === 'past_due') {
      await updateSubscription(customerId, {
        stripeSubscriptionId: null,
        stripeProductId: null,
        planName: null,
        subscriptionStatus: status,
      })
    }
  } catch (error) {
    console.error('Error handling subscription change:', error)
    throw error
  }
}

export async function getStripePrices() {
  try {
    const prices = await stripe.prices.list({
      expand: ['data.product'],
      active: true,
      type: 'recurring',
    })

    return prices.data.map((price) => ({
      id: price.id,
      productId: typeof price.product === 'string' ? price.product : price.product.id,
      unitAmount: price.unit_amount,
      currency: price.currency,
      interval: price.recurring?.interval,
      intervalCount: price.recurring?.interval_count,
      trialPeriodDays: price.recurring?.trial_period_days,
      product: typeof price.product === 'string' ? null : {
        id: price.product.id,
        name: (price.product as Stripe.Product).name,
        description: (price.product as Stripe.Product).description,
      },
    }))
  } catch (error) {
    console.error('Error fetching Stripe prices:', error)
    throw error
  }
}

export async function getStripeProducts() {
  try {
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    })

    return products.data.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      defaultPriceId:
        typeof product.default_price === 'string'
          ? product.default_price
          : product.default_price?.id,
    }))
  } catch (error) {
    console.error('Error fetching Stripe products:', error)
    throw error
  }
}