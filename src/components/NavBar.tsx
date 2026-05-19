import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './NavBar.css'

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="navbar">
      <NavLink to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
        <img src="/Logo Heartbeat GIF.gif" alt="Gateway Locksport" className="navbar-logo" />
      </NavLink>

      <nav className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/calendar" className={({ isActive }) => isActive ? 'active' : ''}>Calendar</NavLink>
        <NavLink to="/gallery" className={({ isActive }) => isActive ? 'active' : ''}>Gallery</NavLink>
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
          <NavLink to="/gallery" onClick={() => setMenuOpen(false)}>Gallery</NavLink>
          <NavLink to="/archive" onClick={() => setMenuOpen(false)}>Archive</NavLink>
          <NavLink to="/signup" onClick={() => setMenuOpen(false)}>Email List</NavLink>
        </nav>
      )}
    </header>
  )
}
