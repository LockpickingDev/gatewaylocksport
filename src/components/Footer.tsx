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
            <li><NavLink to="/products">Products</NavLink></li>
<li><NavLink to="/signup">Email List Signup</NavLink></li>
          </ul>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">Connect</div>
          <div className="social-row">
            <a
              className="social-btn"
              href="https://www.meetup.com/gateway-locksport/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/icons/meetup.png?v=2" alt="" className="social-btn-icon" />
              Meetup Group
            </a>
            <a
              className="social-btn"
              href="https://www.facebook.com/groups/gatewaylockpicking"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/icons/facebook.png?v=2" alt="" className="social-btn-icon" />
              Facebook Group
            </a>
            <a
              className="social-btn"
              href="https://www.instagram.com/gatewaylocksport/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/icons/instagram.png?v=2" alt="" className="social-btn-icon" />
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

      <div className="footer-support">
        <span className="footer-support-text">
          Love what we do? Support the club with a cash donation to Dev at any meetup, or donate via{' '}
          <a
            href="https://venmo.com/u/LockpickingDevEvents"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-support-link"
          >
            Venmo
          </a>.
        </span>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Gateway Locksport. All rights reserved.</p>
      </div>
    </footer>
  )
}
