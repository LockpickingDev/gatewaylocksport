import type { VercelRequest, VercelResponse } from '@vercel/node'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = 'Gateway Locksport <events@gatewaylocksport.com>'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://gatewaylocksport.com'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, nameAlias, token } = req.body

  if (!email || !token) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const greeting = nameAlias ? `Hi ${nameAlias}` : 'Hi there'
  const confirmUrl = `${BASE_URL}/confirm?token=${token}`

  const html = `
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #0F0E0C;">
      <div style="background: #0F0E0C; padding: 24px 32px; border-bottom: 3px solid #C9A84C;">
        <h1 style="font-family: Arial, sans-serif; color: #C9A84C; font-size: 22px; margin: 0; letter-spacing: 0.08em; text-transform: uppercase;">
          Gateway Locksport
        </h1>
      </div>

      <div style="padding: 32px;">
        <p style="font-size: 16px; margin: 0 0 16px;">${greeting},</p>
        <p style="font-size: 16px; margin: 0 0 24px;">
          Thanks for signing up for Gateway Locksport event notifications. Click the button below to confirm your email address.
        </p>

        <a href="${confirmUrl}"
          style="display: inline-block; background: #C9A84C; color: #0F0E0C; font-family: Arial, sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 14px 28px; border-radius: 4px; text-decoration: none;">
          Confirm my email
        </a>

        <p style="font-size: 13px; color: #888780; margin: 24px 0 0;">
          If you didn't sign up for this list, you can safely ignore this email.
        </p>
        <p style="font-size: 13px; color: #888780; margin: 8px 0 0;">
          Or copy and paste this link into your browser:<br />
          <span style="color: #3A3830;">${confirmUrl}</span>
        </p>
      </div>

      <div style="background: #0F0E0C; padding: 16px 32px; text-align: center;">
        <p style="font-size: 12px; color: #555248; margin: 0;">
          © ${new Date().getFullYear()} Gateway Locksport · St. Louis, MO
        </p>
      </div>
    </div>
  `

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject: 'Confirm your Gateway Locksport subscription',
        html
      })
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('Resend error:', err)
      return res.status(500).json({ error: 'Failed to send confirmation email' })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Send confirmation error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}