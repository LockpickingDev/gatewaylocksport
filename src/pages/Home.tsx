import type { Event } from '../types'
import { useEvents } from '../hooks/useEvents'
import './Home.css'

export default function Home() {
  const { events, loading, error } = useEvents()

  const today = new Date()
  const upcoming = events
    .filter(e => new Date(e.date + 'T12:00:00') >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 15)

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-img">
          <LockIcon />
        </div>
        <h1>Gateway Locksport</h1>
        <p>St. Louis's home for lock sport enthusiasts — where curiosity meets craftsmanship, and every pin is a puzzle waiting to be solved.</p>
        <div className="hero-rule" />
      </section>

      <section className="events-section">
        <div className="events-header">
          <div className="section-label">Upcoming Events</div>
          <div className="section-title">What's Coming Up</div>
        </div>

        {loading && <p className="events-status">Loading events...</p>}
        {error && <p className="events-status error">{error}</p>}
        {!loading && !error && upcoming.length === 0 && (
          <p className="events-status">No upcoming events scheduled yet. Check back soon.</p>
        )}
        {!loading && !error && upcoming.length > 0 && (
          <div className="event-list">
            {upcoming.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function EventCard({ event }: { event: Event }) {
  const d = new Date(event.date + 'T12:00:00')
  const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase()
  const day = d.getDate()
  const year = d.getFullYear()

  return (
    <div className="event-card">
      <div className="event-date-badge">
        <span className="badge-month">{month}</span>
        <span className="badge-day">{day}</span>
        <span className="badge-year">{year}</span>
      </div>
      <div className="event-body">
        <h3 className="event-name">{event.name}</h3>
        <div className="event-meta">
          <span className="event-time">{event.time}</span>
          <a
            className="event-location"
            href={event.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <PinIcon />
            {event.location}
          </a>
        </div>
        <p className="event-desc">{event.description}</p>
      </div>
    </div>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 1C9.24 1 7 3.24 7 6v2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6c0-2.76-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3v2H9V6c0-1.66 1.34-3 3-3zm0 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
    </svg>
  )
}