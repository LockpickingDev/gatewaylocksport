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
    label: 'Meetup',
    value: 'meetup.com/Gateway-Locksport/',
    href: 'https://www.meetup.com/gateway-locksport/',
    icon: <img src="/icons/meetup.png?v=2" alt="" className="links-item-icon-img" />,
    color: '#FF4A79',
  },
  {
    label: 'Facebook',
    value: 'facebook.com/groups/GatewayLockpicking',
    href: 'https://www.facebook.com/groups/gatewaylocksport',
    icon: <img src="/icons/facebook.png?v=2" alt="" className="links-item-icon-img" />,
    color: '#0866FF',
  },
  {
    label: 'Instagram',
    value: '@gatewaylocksport',
    href: 'https://www.instagram.com/gatewaylocksport/',
    icon: <img src="/icons/instagram.png?v=2" alt="" className="links-item-icon-img" />,
    color: '#FF0069',
  },
  {
    label: 'Lockpickers United',
    value: 'Lockpickers United Links',
    href: 'https://lockpickersunited.com/',
    icon: <img src="/icons/LPU Logo.png?v=2" alt="" className="links-item-icon-img" />,
    color: '#5865F2',
  },
  {
    label: 'Email',
    value: 'GatewayLocksport@gmail.com',
    href: 'mailto:GatewayLocksport@gmail.com',
    icon: <img src="/icons/gmail.png?v=2" alt="" className="links-item-icon-img" />,
    color: '#EA4335',
  },
  {
    label: 'Donate',
    value: '@LockpickingDevEvents',
    href: 'https://venmo.com/u/LockpickingDevEvents',
    icon: <img src="/icons/venmo.png?v=2" alt="" className="links-item-icon-img" />,
    color: '#008CFF',
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

function EmailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
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
