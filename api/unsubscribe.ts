import type { VercelRequest, VercelResponse } from '@vercel/node'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { token } = req.body ?? {}

  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    return res.status(400).json({ error: 'Missing token' })
  }

  try {
    initFirebaseAdmin()
    const db = getFirestore()

    const snapshot = await db
      .collection('Subscribers')
      .where('unsubscribeToken', '==', token.trim())
      .limit(1)
      .get()

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Invalid unsubscribe token' })
    }

    await snapshot.docs[0].ref.delete()

    return res.status(200).json({ success: true })
  } 
  catch (err) {
    console.error('Unsubscribe error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
