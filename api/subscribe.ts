import type { VercelRequest, VercelResponse } from '@vercel/node'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { randomUUID } from 'crypto'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = 'Gateway Locksport <events@gatewaylocksport.com>'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://gatewaylocksport.com'

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/
const MAX_EMAIL_LENGTH = 254
const MAX_ALIAS_LENGTH = 50

function initFirebaseAdmin() {
  if (getApps().length > 0) return
  const sa = JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON || '{}')
  initializeApp({
    credential: cert({
      projectId: sa.project_id,
      clientEmail: sa.client_email,
      privateKey: sa.private_key
    })
  })
}

function sanitizeAlias(alias: string): string {
  return alias.replace(/[<>"'&;\\]/g, '').trim().slice(0, MAX_ALIAS_LENGTH)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = req.body ?? {}
  const { email, nameAlias } = body

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' })
  }

  const normalizedEmail = email.toLowerCase().trim()

  if (normalizedEmail.length > MAX_EMAIL_LENGTH || !EMAIL_REGEX.test(normalizedEmail)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  const sanitizedAlias = typeof nameAlias === 'string' ? sanitizeAlias(nameAlias) : ''

  try {
    initFirebaseAdmin()
    const db = getFirestore()

    const existingSnapshot = await db
      .collection('Subscribers')
      .where('email', '==', normalizedEmail)
      .limit(1)
      .get()

    if (!existingSnapshot.empty) {
      const existing = existingSnapshot.docs[0].data()
      if (existing.confirmed) {
        return res.status(409).json({ error: 'This email is already subscribed' })
      }
      return res.status(200).json({
        pending: true,
        message: 'A confirmation email was already sent. Please check your inbox.'
      })
    }

    const token = randomUUID()
    const unsubscribeToken = randomUUID()

    await db.collection('Subscribers').add({
      nameAlias: sanitizedAlias,
      email: normalizedEmail,
      subscribedAt: new Date().toISOString().split('T')[0],
      confirmed: false,
      token,
      unsubscribeToken
    })

    await sendConfirmationEmail(normalizedEmail, sanitizedAlias, token, unsubscribeToken)

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Subscribe error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function sendConfirmationEmail(
  email: string,
  nameAlias: string,
  token: string,
  unsubscribeToken: string
): Promise<void> {
  const greeting = nameAlias ? `Hi ${nameAlias}` : 'Hi there'
  const confirmUrl = `${BASE_URL}/confirm?token=${encodeURIComponent(token)}`
  const unsubscribeUrl = `${BASE_URL}/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`

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
          If the button above doesn't work, copy and paste this link into your browser:<br />
          <span style="color: #3A3830;">${confirmUrl}</span>
        </p>
      </div>

      <div style="background: #0F0E0C; padding: 16px 32px; text-align: center;">
        <p style="font-size: 12px; color: #555248; margin: 0;">
          &copy; ${new Date().getFullYear()} Gateway Locksport &middot; St. Louis, MO
        </p>
        <p style="font-size: 11px; color: #555248; margin: 8px 0 0;">
          <a href="${unsubscribeUrl}" style="color: #888780; text-decoration: underline;">Unsubscribe</a>
        </p>
      </div>
    </div>
  `

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
    throw new Error(`Resend error: ${JSON.stringify(err)}`)
  }
}
