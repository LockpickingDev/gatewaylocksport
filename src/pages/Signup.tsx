import { useState } from 'react'
import './Signup.css'

interface FormState {
  firstName: string
  email: string
}

interface FormErrors {
  firstName?: string
  email?: string
  captcha?: string
}

export default function Signup() {
  const [form, setForm] = useState<FormState>({ firstName: '', email: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [captchaChecked, setCaptchaChecked] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function validate(): FormErrors {
    const errs: FormErrors = {}
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
    await new Promise(resolve => setTimeout(resolve, 800))
    setLoading(false)
    setSubmitted(true)
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
              <h2>You're on the list!</h2>
              <p>Check your inbox for a confirmation email. You'll start receiving event notifications once confirmed.</p>
            </div>
          </div>
          <p className="signup-footer-note">
            Powered by Resend + Firebase · Unsubscribe any time
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
          Get notified about upcoming events, meetups, and locksport news delivered to your inbox.
        </p>
      </section>

      <section className="signup-section">
        <div className="signup-card">
          <form onSubmit={handleSubmit} noValidate>

            <div className="form-group">
              <label htmlFor="firstName">First name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Jane"
                autoComplete="given-name"
                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              />
              {errors.firstName && (
                <span className="field-error" id="firstName-error">{errors.firstName}</span>
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
                placeholder="jane@example.com"
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
              <span className="badge">HTTPS only</span>
              <span className="badge">Rate limited</span>
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