import { useState } from 'react'
import type { Event } from '../types'
import { useEvents } from '../hooks/useEvents'
import './Archive.css'

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const ampm = h < 12 ? 'AM' : 'PM'
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`
}

export default function Archive() {
  const { events, loading, error } = useEvents()
  const todayStr = new Date().toISOString().split('T')[0]

  const pastEvents = events
    .filter(e => e.date < todayStr)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const byYear = pastEvents.reduce<Record<number, Event[]>>((acc, event) => {
    if (!acc[event.year]) acc[event.year] = []
    acc[event.year].push(event)
    return acc
  }, {})

  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a)

  const earliestYear = years.length > 0 ? years[years.length - 1] : null

  return (
    <div className="archive">
      <section className="archive-hero">
        <div className="section-label">History</div>
        <div className="section-title">Past Events</div>
      </section>

      <section className="archive-section">
        {loading && <p className="events-status">Loading events...</p>}
        {error && <p className="events-status error">{error}</p>}
        {!loading && !error && years.length === 0 && (
          <p className="events-status">No past events yet. Check back after our first year!</p>
        )}
        {!loading && !error && years.length > 0 && (
          <>
            <p className="archive-count">
              {pastEvents.length} event{pastEvents.length !== 1 ? 's' : ''} · picking locks & making friends since {earliestYear}
            </p>
            {years.map(year => (
              <YearGroup key={year} year={year} events={byYear[year]} />
            ))}
          </>
        )}
      </section>
    </div>
  )
}

function YearGroup({ year, events }: { year: number; events: Event[] }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="year-group">
      <button
        className="year-heading"
        onClick={() => setCollapsed(prev => !prev)}
        aria-expanded={!collapsed}
      >
        <ChevronIcon collapsed={collapsed} />
        {year} — {events.length} event{events.length !== 1 ? 's' : ''}
      </button>

      {!collapsed && (
        <div className="year-events">
          {events.map(event => (
            <ArchiveEventRow key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}

function ArchiveEventRow({ event }: { event: Event }) {
  const [expanded, setExpanded] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const d = new Date(event.date + 'T12:00:00')
  const formatted = d.toLocaleString('en-US', { month: 'short', day: 'numeric' })
  const longDesc = (event.description?.length ?? 0) > 120

  return (
    <>
    <div className="archive-event">
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.name}
          className="archive-event-thumb archive-event-thumb--clickable"
          onClick={() => setLightboxOpen(true)}
        />
      )}
      <div className="archive-event-date">
        <span>{formatted}, {event.year}</span>
        <span className="archive-event-time">{formatTime(event.time)}</span>
      </div>
      <div className="archive-event-body">
        <span className="archive-event-name">{event.name}</span>
        <a
          className="archive-event-loc"
          href={event.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {event.location.split(',')[0]}
        </a>
      </div>
      {event.description && (
        <div className="archive-event-desc-wrap">
          <p className={`archive-event-desc${expanded ? ' expanded' : ''}`}>
            {event.description}
          </p>
          {longDesc && (
            <button className="archive-read-more" onClick={() => setExpanded(p => !p)}>
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}
    </div>

    {lightboxOpen && event.imageUrl && (
      <div className="lightbox" onClick={() => setLightboxOpen(false)}>
        <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
          <button className="lightbox-close" onClick={() => setLightboxOpen(false)} aria-label="Close">
            <CloseIcon />
          </button>
          <img src={event.imageUrl} alt={event.name} />
          <div className="lightbox-meta">
            <span className="lightbox-caption">{event.name}</span>
            <span className="lightbox-date">{formatted}, {event.year}</span>
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

function ChevronIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
    >
      <path d="M7 10l5 5 5-5z" />
    </svg>
  )
}