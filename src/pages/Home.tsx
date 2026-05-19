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
          <img src="/Gateway-Locksport-Logo-PNG-white-no-words-black-keyhole.png" alt="" aria-hidden="true" />
        </div>
        <h1>Gateway Locksport</h1>
        <p className="hero-about">
          A St. Louis area community open to everyone interested in lockpicking, physical security, and locksport. We host free monthly meetups in St. Louis and St. Charles, Missouri — welcoming everyone from curious newcomers to seasoned sport pickers. We are a proud{' '}
          <a href="https://lockpickersunited.com/" target="_blank" rel="noopener noreferrer">Lockpickers United</a>{' '}
          group.
        </p>
        <div className="hero-rule" />
      </section>

      <section className="events-section">
        <div className="events-header">
          <h2 className="events-heading">Upcoming Events</h2>
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

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const ampm = h < 12 ? 'AM' : 'PM'
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`
}

function EventCard({ event }: { event: Event }) {
  const d = new Date(event.date + 'T12:00:00')
  const dateStr = d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const timeStr = formatTime(event.time)

  return (
    <div className={`event-card${event.imageUrl ? ' event-card--has-img' : ''}`}>
      {event.imageUrl && (
        <div className="event-card-img">
          <img src={event.imageUrl} alt={event.name} />
        </div>
      )}
      <div className="event-body">
        <h3 className="event-name">{event.name}</h3>
        <div className="event-meta">
          <span className="event-datetime">{dateStr} · {timeStr}</span>
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

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
    </svg>
  )
}