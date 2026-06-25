import SEO from '../components/SEO'
import './Links.css'

const LINKS = [
  {
    label: 'Join Mailing List',
    value: 'GatewayLocksport.com/signup',
    href: 'https://gatewaylocksport.com/signup',
    icon: <EmailIcon />,
    color: '#ffb81c',
  },
  {
    label: 'Email',
    value: 'GatewayLocksport@gmail.com',
    href: 'mailto:GatewayLocksport@gmail.com',
    icon: <GlobeIcon />,
    color: '#EA4335',
  },
  {
    label: 'Facebook',
    value: 'facebook.com/groups/gatewaylockpicking',
    href: 'https://www.facebook.com/groups/gatewaylockpicking',
    icon: <FacebookIcon />,
    color: '#1877F2',
  },
  {
    label: 'Instagram',
    value: '@gatewaylocksport',
    href: 'https://www.instagram.com/gatewaylocksport/',
    icon: <InstagramIcon />,
    color: '#E1306C',
  },
  {
    label: 'Donate',
    value: '@LockpickingDevEvents',
    href: 'https://venmo.com/u/LockpickingDevEvents',
    icon: <VenmoIcon />,
    color: '#3D95CE',
  },
]

export default function Links() {
  return (
    <div className="links-page">
      <SEO title="Links" canonical="/links" noindex />

      <div className="links-card">
        <div className="links-header">
          <img
            src="/Gateway-Locksport-Logo-PNG-white-no-words.png"
            alt="Gateway Locksport"
            className="links-logo"
          />
          <h1 className="links-title">Gateway Locksport</h1>
          <p className="links-sub">St. Louis Locksport Club</p>
        </div>

        <nav className="links-list">
          {LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="links-item"
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              style={{ '--link-color': link.color } as React.CSSProperties}
            >
              <span className="links-item-icon" style={{ color: link.color }}>{link.icon}</span>
              <span className="links-item-body">
                <span className="links-item-label">{link.label}</span>
                <span className="links-item-value">{link.value}</span>
              </span>
              <ArrowIcon />
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}

function GlobeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function VenmoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.5 3c.83 1.34 1.2 2.72 1.2 4.46 0 5.57-4.77 12.8-8.65 17.88H7.1L4.3 6.7l5.95-.57 1.49 12.04c1.39-2.27 3.11-5.83 3.11-8.25 0-1.33-.23-2.24-.59-2.99L20.5 3z" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="links-arrow">
      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
    </svg>
  )
}
