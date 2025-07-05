import transporter from "./config"

interface EmailOptions {
  to: string
  from?: string
  subject: string
  html: string
  text?: string
}

export const sendEmail = async (options: EmailOptions) => {
  const from = options.from || process.env.FROM_EMAIL
  return transporter.sendMail({ ...options, from })
}

// Magic Link Email
export const sendMagicLinkEmail = async (email: string, token: string) => {
  const magicLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Sign in to your account</h2>
      <p>Click the link below to sign in to your account:</p>
      <a href="${magicLink}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 16px 0;">
        Sign In
      </a>
      <p>Or copy and paste this URL into your browser:</p>
      <p style="word-break: break-all;">${magicLink}</p>
      <p style="color: #6b7280; font-size: 0.875rem;">This link will expire in 15 minutes.</p>
    </div>
  `

  return sendEmail({
    to: email,
    subject: 'Your Sign In Link',
    html,
    text: `Sign in to your account: ${magicLink}\n\nThis link will expire in 15 minutes.`,
  })
}

// Welcome Email
export const sendWelcomeEmail = async (email: string, name?: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Welcome to ${process.env.NEXT_PUBLIC_APP_NAME || 'Our Service'}!</h2>
      <p>Hi ${name || 'there'},</p>
      <p>Thank you for signing up! We're excited to have you on board.</p>
      <p>Here's what you can do next:</p>
      <ul>
        <li>Complete your profile</li>
        <li>Explore our features</li>
        <li>Invite your team members</li>
      </ul>
      <p>If you have any questions, feel free to reply to this email.</p>
      <p>Best regards,<br>The ${process.env.NEXT_PUBLIC_APP_NAME || 'Our Service'} Team</p>
    </div>
  `

  return sendEmail({
    to: email,
    subject: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME || 'Our Service'}`,
    html,
    text: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME || 'Our Service'}! Thank you for signing up.`,
  })
}

// Newsletter Email
export const sendNewsletterEmail = async (email: string, content: string, subject: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">${subject}</h2>
      <div>${content}</div>
      <p style="color: #6b7280; font-size: 0.875rem; margin-top: 32px;">
        You're receiving this email because you subscribed to our newsletter.
        <br>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #2563eb;">Unsubscribe</a>
      </p>
    </div>
  `

  return sendEmail({
    to: email,
    subject,
    html,
    text: `${subject}\n\n${content.replace(/<[^>]*>/g, '')}\n\nUnsubscribe: ${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${encodeURIComponent(email)}`,
  })
}