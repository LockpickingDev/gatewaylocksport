import { useState } from 'react'
import type { Event } from '../types'
import { useEvents } from '../hooks/useEvents'
import './Archive.css'

export default function Archive() {
  const { events, loading, error } = useEvents()
  const currentYear = new Date().getFullYear()

  const pastEvents = events
    .filter(e => e.year < currentYear)

  const byYear = pastEvents.reduce<Record<number, Event[]>>((acc, event) => {
    if (!acc[event.year]) acc[event.year] = []
    acc[event.year].push(event)
    return acc
  }, {})

  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a)

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
          years.map(year => (
            <YearGroup key={year} year={year} events={byYear[year]} />
          ))
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
  const d = new Date(event.date + 'T12:00:00')
  const formatted = d.toLocaleString('en-US', { month: 'short', day: 'numeric' })

  return (
    <div className="archive-event">
      <span className="archive-event-date">{formatted}, {event.year}</span>
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
    </div>
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