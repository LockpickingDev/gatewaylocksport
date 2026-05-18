import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import './Confirm.css'

export default function Confirm() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }

    async function confirmSubscription() {
      try {
        const response = await fetch('/api/confirm-subscriber', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        })

        if (response.ok) {
          setStatus('success')
        } else {
          setStatus('error')
        }
      } catch (err) {
        console.error('Confirmation error:', err)
        setStatus('error')
      }
    }

    confirmSubscription()
  }, [token])

  return (
    <div className="confirm-page">
      <div className="confirm-card">
        {status === 'loading' && (
          <>
            <div className="confirm-icon loading">
              <SpinnerIcon />
            </div>
            <h1>Confirming your subscription...</h1>
            <p>Just a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="confirm-icon success">
              <CheckIcon />
            </div>
            <h1>You're confirmed!</h1>
            <p>You'll receive email notifications 3 days before each upcoming Gateway Locksport event.</p>
            <Link to="/" className="confirm-btn">View upcoming events</Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="confirm-icon error">
              <ErrorIcon />
            </div>
            <h1>Something went wrong</h1>
            <p>This confirmation link may have already been used or is invalid. If you're having trouble, sign up again on the email list page.</p>
            <Link to="/signup" className="confirm-btn">Back to signup</Link>
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