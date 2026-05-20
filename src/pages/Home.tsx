import { useState, useRef, useEffect } from 'react'
import type { Event } from '../types'
import { useEvents } from '../hooks/useEvents'
import './Home.css'

export default function Home() {
  const { events, loading, error } = useEvents()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.8
  }, [])

  const todayStr = new Date().toISOString().split('T')[0]
  const upcoming = events
    .filter(e => e.date >= todayStr)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 15)

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-video">
          <video ref={videoRef} autoPlay muted loop playsInline aria-hidden="true">
            <source src="/GL Banner horizontal.mp4" type="video/mp4" />
          </video>
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
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const d = new Date(event.date + 'T12:00:00')
  const dateStr = d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const timeStr = formatTime(event.time)

  return (
    <>
      <div className={`event-card${event.imageUrl ? ' event-card--has-img' : ''}`}>
        {event.imageUrl && (
          <div className="event-card-img event-card-img--clickable" onClick={() => setLightboxOpen(true)}>
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

      {lightboxOpen && (
        <div className="lightbox" onClick={() => setLightboxOpen(false)}>
          <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxOpen(false)} aria-label="Close">
              <CloseIcon />
            </button>
            <img src={event.imageUrl} alt={event.name} />
            <div className="lightbox-meta">
              <span className="lightbox-caption">{event.name}</span>
              <span className="lightbox-date">{dateStr}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
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