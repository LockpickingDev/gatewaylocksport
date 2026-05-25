import { useState } from 'react'
import './Signup.css'

interface FormState {
  nameAlias: string
  email: string
}

interface FormErrors {
  nameAlias?: string
  email?: string
  captcha?: string
}

const MAX_ALIAS_LENGTH = 50

export default function Signup() {
  const [form, setForm] = useState<FormState>({ nameAlias: '', email: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [captchaChecked, setCaptchaChecked] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [alreadyPending, setAlreadyPending] = useState(false)
  const [loading, setLoading] = useState(false)

  function validate(): FormErrors {
    const errs: FormErrors = {}
    if (form.nameAlias.length > MAX_ALIAS_LENGTH) {
      errs.nameAlias = `Alias must be ${MAX_ALIAS_LENGTH} characters or fewer`
    }
    if (!form.email.trim()) {
      errs.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email address'
    }
    if (!captchaChecked) errs.captcha = 'Please confirm you are not a robot'
    return errs
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setLoading(true)
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          nameAlias: form.nameAlias
        })
      })

      const data = await response.json()

      if (response.status === 409) {
        setErrors({ email: 'This email is already subscribed.' })
        return
      }

      if (!response.ok) {
        setErrors({ email: data.error || 'Something went wrong. Please try again.' })
        return
      }

      if (data.pending) {
        setAlreadyPending(true)
      }

      setSubmitted(true)
    } catch {
      setErrors({ email: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="signup-page">
        <section className="signup-hero">
          <div className="section-label">Stay Connected</div>
          <div className="section-title">Email List Signup</div>
        </section>
        <section className="signup-section">
          <div className="signup-card">
            <div className="success-state">
              <CheckIcon />
              <h2>{alreadyPending ? 'Check your inbox' : 'Almost there!'}</h2>
              <p>
                {alreadyPending
                  ? 'A confirmation email was already sent to that address. Please check your inbox and click the link to confirm.'
                  : 'Check your inbox for a confirmation email and click the link inside to complete your signup.'}
              </p>
            </div>
          </div>
          <p className="signup-footer-note">
            Unsubscribe any time
          </p>
        </section>
      </div>
    )
  }

  return (
    <div className="signup-page">
      <section className="signup-hero">
        <div className="section-label">Stay Connected</div>
        <div className="section-title">Email List Signup</div>
        <p className="signup-hero-sub">
          Get notified about upcoming meetups and events.
        </p>
      </section>

      <section className="signup-section">
        <div className="signup-card">
          <form onSubmit={handleSubmit} noValidate>

            <div className="form-group">
              <label htmlFor="nameAlias">Name/Alias</label>
              <input
                type="text"
                id="nameAlias"
                name="nameAlias"
                value={form.nameAlias}
                onChange={handleChange}
                placeholder="Alias"
                autoComplete="given-name"
                maxLength={MAX_ALIAS_LENGTH}
                aria-describedby={errors.nameAlias ? 'nameAlias-error' : undefined}
              />
              {errors.nameAlias && (
                <span className="field-error" id="nameAlias-error">{errors.nameAlias}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email address <span className="required" aria-hidden="true">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="alias@example.com"
                autoComplete="email"
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <span className="field-error" id="email-error">{errors.email}</span>
              )}
              <span className="field-hint">Used only for Gateway Locksport event notifications. Never sold or shared.</span>
            </div>

            <div className="captcha-box">
              <input
                type="checkbox"
                id="captcha"
                checked={captchaChecked}
                onChange={e => {
                  setCaptchaChecked(e.target.checked)
                  if (errors.captcha) setErrors(prev => ({ ...prev, captcha: undefined }))
                }}
              />
              <label htmlFor="captcha">I am not a robot</label>
              <span className="captcha-brand">Cloudflare<br />Turnstile</span>
            </div>
            {errors.captcha && (
              <span className="field-error">{errors.captcha}</span>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Subscribing...' : 'Subscribe to Event Updates'}
            </button>

            <div className="security-badges">
              <span className="badge">Double opt-in</span>
            </div>

          </form>
        </div>

        <p className="signup-footer-note">
          Powered by Resend + Firebase · Unsubscribe any time
        </p>
      </section>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14l-4-4 1.41-1.41L10 13.17l6.59-6.59L18 8l-8 8z" />
    </svg>
  )
}
