import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './NavBar.css'

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="navbar">
      <NavLink to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
        <LockIcon />
        <span>Gateway Locksport</span>
      </NavLink>

      <nav className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/calendar" className={({ isActive }) => isActive ? 'active' : ''}>Calendar</NavLink>
        <NavLink to="/archive" className={({ isActive }) => isActive ? 'active' : ''}>Archive</NavLink>
        <NavLink to="/signup" className={({ isActive }) => isActive ? 'active' : ''}>Email List</NavLink>
      </nav>

      <button
        className={`hamburger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(prev => !prev)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      {menuOpen && (
        <nav className="mobile-menu">
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/calendar" onClick={() => setMenuOpen(false)}>Calendar</NavLink>
          <NavLink to="/archive" onClick={() => setMenuOpen(false)}>Archive</NavLink>
          <NavLink to="/signup" onClick={() => setMenuOpen(false)}>Email List</NavLink>
        </nav>
      )}
    </header>
  )
}

function LockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 1C9.24 1 7 3.24 7 6v2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6c0-2.76-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3v2H9V6c0-1.66 1.34-3 3-3zm0 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
    </svg>
  )
}