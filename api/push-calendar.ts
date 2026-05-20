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

  const { name, date, time, location, description } = req.body

  if (!name || !date || !time || !location || !description) {
    return res.status(400).json({ error: 'Missing required fields' })
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

    const startDateTime = `${date}T${time}:00`
    const start = new Date(startDateTime)
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)
    const endDateTime = end.toISOString().slice(0, 19)

    const calendarEvent = {
      summary: name,
      location,
      description,
      start: {
        dateTime: `${date}T${time}:00`,
        timeZone: 'America/Chicago'
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'America/Chicago'
      }
    }

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(calendarEvent)
      }
    )

    if (!response.ok) {
      const err = await response.json()
      console.error('Calendar API error full details:', JSON.stringify(err, null, 2))
      console.error('Response status:', response.status)
      console.error('Service account email:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL)
      return res.status(500).json({ error: 'Calendar API error', details: err })
    }

    const created = await response.json()
    return res.status(200).json({ success: true, calendarEventId: created.id })
  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}