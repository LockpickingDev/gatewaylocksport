import type { VercelRequest, VercelResponse } from '@vercel/node'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { token } = req.body

  if (!token) {
    return res.status(400).json({ error: 'Missing token' })
  }

  try {
    initFirebaseAdmin()
    const db = getFirestore()

    const snapshot = await db
      .collection('Subscribers')
      .where('token', '==', token)
      .where('confirmed', '==', false)
      .get()

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Invalid or already confirmed token' })
    }

    const subscriberDoc = snapshot.docs[0]
    await subscriberDoc.ref.update({ confirmed: true })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Confirm subscriber error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}