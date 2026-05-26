import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import SEO from '../components/SEO'
import './Confirm.css'

export default function Unsubscribe() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }

    async function doUnsubscribe() {
      try {
        const response = await fetch('/api/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        })

        if (response.ok) {
          setStatus('success')
        } else {
          setStatus('error')
        }
      } catch {
        setStatus('error')
      }
    }

    doUnsubscribe()
  }, [token])

  return (
    <div className="confirm-page">
      <SEO title="Unsubscribe" canonical="/unsubscribe" noindex />
      <div className="confirm-card">
        {status === 'loading' && (
          <>
            <div className="confirm-icon loading">
              <SpinnerIcon />
            </div>
            <h1>Unsubscribing...</h1>
            <p>Just a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="confirm-icon success">
              <CheckIcon />
            </div>
            <h1>You've been unsubscribed</h1>
            <p>You will no longer receive event notifications from Gateway Locksport. We're sorry to see you go!</p>
            <Link to="/signup" className="confirm-btn">Resubscribe</Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="confirm-icon error">
              <ErrorIcon />
            </div>
            <h1>Something went wrong</h1>
            <p>This unsubscribe link may have already been used or is invalid. If you need help, please contact us.</p>
            <Link to="/" className="confirm-btn">Go to homepage</Link>
          </>
        )}
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14l-4-4 1.41-1.41L10 13.17l6.59-6.59L18 8l-8 8z" />
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  )
}

function SpinnerIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="spinner">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  )
}
