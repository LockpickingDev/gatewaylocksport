import { NavLink } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-col">
          <div className="footer-col-title">Navigation</div>
          <ul className="footer-links">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/calendar">Calendar</NavLink></li>
            <li><NavLink to="/gallery">Gallery</NavLink></li>
            <li><NavLink to="/archive">Archive</NavLink></li>
            <li><NavLink to="/signup">Email List Signup</NavLink></li>
          </ul>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">Connect</div>
          <div className="social-row">
            <a
              className="social-btn"
              href="https://www.facebook.com/groups/gatewaylockpicking"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon />
              Facebook Group
            </a>
            <a
              className="social-btn"
              href="https://www.instagram.com/gatewaylocksport/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon />
              Instagram
            </a>
          </div>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">About</div>
          <p className="footer-about">
            Gateway Locksport is a community of lock enthusiasts based in the St. Louis metro area.
          </p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Gateway Locksport. All rights reserved.</p>
      </div>
    </footer>
  )
}

function FacebookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="#0F0E0C" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="#0F0E0C" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}