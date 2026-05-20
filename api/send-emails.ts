import type { VercelRequest, VercelResponse } from '@vercel/node'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = 'Gateway Locksport <events@gatewaylocksport.com>'

function initFirebaseAdmin() {
  if (getApps().length > 0) return
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON || '{}')
  initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key
    })
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    initFirebaseAdmin()
    const db = getFirestore()

    const today = new Date().toISOString().split('T')[0]
    console.log('Checking for events with emailSendDate:', today)

    const eventsSnapshot = await db
      .collection('Events')
      .where('emailSendDate', '==', today)
      .get()

    if (eventsSnapshot.empty) {
      console.log('No events to send today')
      return res.status(200).json({ message: 'No events to send today' })
    }

    const subscribersSnapshot = await db
      .collection('Subscribers')
      .where('confirmed', '==', true)
      .get()

    if (subscribersSnapshot.empty) {
      console.log('No subscribers found')
      return res.status(200).json({ message: 'No subscribers found' })
    }

    const subscribers = subscribersSnapshot.docs.map(doc => doc.data())
    console.log(`Found ${subscribers.length} subscribers`)

    const results = []

    for (const eventDoc of eventsSnapshot.docs) {
      const event = eventDoc.data()
      console.log('Sending emails for event:', event.name)

      const emailPromises = subscribers.map(subscriber =>
        sendEventEmail(subscriber.email, subscriber.nameAlias , event)
      )

      const emailResults = await Promise.allSettled(emailPromises)
      const succeeded = emailResults.filter(r => r.status === 'fulfilled').length
      const failed = emailResults.filter(r => r.status === 'rejected').length

      results.push({
        event: event.name,
        succeeded,
        failed
      })
    }

    return res.status(200).json({ success: true, results })
  } catch (err) {
    console.error('Send emails error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

async function sendEventEmail(
  to: string,
  nameAlias : string,
  event: any
): Promise<void> {
  const greeting = nameAlias  ? `Hi ${nameAlias }` : 'Hi there'

  const html = `
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #0F0E0C;">
      <div style="background: #0F0E0C; padding: 24px 32px; border-bottom: 3px solid #C9A84C;">
        <h1 style="font-family: Arial, sans-serif; color: #C9A84C; font-size: 22px; margin: 0; letter-spacing: 0.08em; text-transform: uppercase;">
          Gateway Locksport
        </h1>
      </div>

      <div style="padding: 32px;">
        <p style="font-size: 16px; margin: 0 0 24px;">${greeting},</p>
        <p style="font-size: 16px; margin: 0 0 24px;">
          You have an upcoming Gateway Locksport event coming up soon!
        </p>

        <div style="background: #F4EFE4; border-left: 4px solid #C9A84C; padding: 20px 24px; margin: 0 0 24px; border-radius: 0 4px 4px 0;">
          <h2 style="font-family: Arial, sans-serif; font-size: 18px; margin: 0 0 12px; color: #0F0E0C;">
            ${event.name}
          </h2>
          <p style="margin: 0 0 8px; font-size: 14px; color: #3A3830;">
            <strong>Date:</strong> ${formatDate(event.date)}
          </p>
          <p style="margin: 0 0 8px; font-size: 14px; color: #3A3830;">
            <strong>Time:</strong> ${formatTime(event.time)}
          </p>
          <p style="margin: 0 0 8px; font-size: 14px; color: #3A3830;">
            <strong>Location:</strong>
            <a href="${event.mapsUrl}" style="color: #8B3A1E;">${event.location}</a>
          </p>
          <p style="margin: 12px 0 0; font-size: 14px; color: #3A3830;">
            ${event.description}
          </p>
        </div>

        <p style="font-size: 14px; color: #888780; margin: 0;">
          You are receiving this because you signed up for Gateway Locksport event notifications.
        </p>
      </div>

      <div style="background: #0F0E0C; padding: 16px 32px; text-align: center;">
        <p style="font-size: 12px; color: #555248; margin: 0;">
          © ${new Date().getFullYear()} Gateway Locksport · St. Louis, MO
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
      to,
      subject: `Reminder: ${event.name} is coming up soon!`,
      html
    })
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(`Resend error: ${JSON.stringify(err)}`)
  }
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number)
  const ampm = hours < 12 ? 'AM' : 'PM'
  const displayHours = hours % 12 === 0 ? 12 : hours % 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
}