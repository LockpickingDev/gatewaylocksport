import type { VercelRequest, VercelResponse } from '@vercel/node'
import { GoogleAuth } from 'google-auth-library'
import { verifyAdmin } from './_auth'

const CALENDAR_ID = 'GatewayLocksport@gmail.com'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!await verifyAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { calendarEventId } = req.body

  if (!calendarEventId) {
    return res.status(400).json({ error: 'Missing calendarEventId' })
  }

  try {
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '{}')

    const auth = new GoogleAuth({
      credentials: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key
      },
      scopes: ['https://www.googleapis.com/auth/calendar.events']
    })

    const client = await auth.getClient()
    const token = await client.getAccessToken()

    if (!token.token) {
      return res.status(500).json({ error: 'Failed to get access token' })
    }

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events/${encodeURIComponent(calendarEventId)}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token.token}`
        }
      }
    )

    if (!response.ok && response.status !== 404) {
      const text = await response.text()
      let err: unknown
      try { err = JSON.parse(text) } catch { err = text }
      console.error('Calendar delete API error:', JSON.stringify(err, null, 2))
      return res.status(500).json({ error: 'Calendar API error', details: err })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
