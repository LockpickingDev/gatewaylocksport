import type { VercelRequest } from '@vercel/node'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const ADMIN_EMAIL = 'gatewaylocksport@gmail.com'

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

export async function verifyAdmin(req: VercelRequest): Promise<boolean> {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return false
  const idToken = header.slice(7)
  try {
    initFirebaseAdmin()
    const decoded = await getAuth().verifyIdToken(idToken)
    return decoded.email === ADMIN_EMAIL
  } catch {
    return false
  }
}
