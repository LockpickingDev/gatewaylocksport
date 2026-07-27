import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import SEO from '../components/SEO'
import type { ScheduleIcon } from './competitionData'
import {
  EVENT,
  QUICK_FACTS,
  SCHEDULE,
  MAIN_EVENTS,
  SIDE_CONTESTS,
  PREP_VIDEOS,
  ACTIVITIES,
  BRING_LOCKS,
  SPONSORS,
  SALE_ITEMS,
} from './competitionData'
import './Competition.css'

const EVENT_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: EVENT.name,
  startDate: EVENT.isoStart,
  endDate: EVENT.isoEnd,
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  eventStatus: 'https://schema.org/EventScheduled',
  isAccessibleForFree: true,
  location: {
    '@type': 'Place',
    name: EVENT.venueName,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '4744 Mid Rivers Mall Dr',
      addressLocality: 'St. Peters',
      addressRegion: 'MO',
      addressCountry: 'US',
    },
  },
  organizer: {
    '@type': 'Organization',
    name: 'Gateway Locksport',
    url: 'https://gatewaylocksport.com',
  },
  description: EVENT.tagline,
}

export default function Competition() {
  const [lightbox, setLightbox] = useState<{ src: string; caption: string } | null>(null)

  return (
    <div className="comp">
      <SEO
        title="2026 Midwest Open Lockpicking Competition"
        description="A full day of lockpicking, learning, and friendly competition in St. Peters, MO. Free to attend, free to compete, no experience required."
        canonical="/competition"
        noindex
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(EVENT_SCHEMA)}</script>
      </Helmet>

      {/* Hero */}
      <section className="comp-hero">
        <p className="comp-hero-kicker">Gateway Locksport Presents</p>
        <h1 className="comp-hero-title">
          2026 Midwest Open
          <span>Lockpicking Competition</span>
        </h1>
        <div className="comp-hero-meta">
          <span className="comp-hero-date">{EVENT.dateLabel}</span>
          <span className="comp-hero-dot">·</span>
          <span>{EVENT.timeLabel}</span>
          <span className="comp-hero-dot">·</span>
          <a href={EVENT.mapsUrl} target="_blank" rel="noopener noreferrer">
            {EVENT.venueName}, {EVENT.venueAddress}
          </a>
        </div>
        <p className="comp-hero-tagline">{EVENT.tagline}</p>
        <div className="comp-cta-row">
          <a className="comp-cta comp-cta--meetup" href={EVENT.meetupUrl} target="_blank" rel="noopener noreferrer">
            RSVP on Meetup
          </a>
          <a className="comp-cta comp-cta--facebook" href={EVENT.facebookUrl} target="_blank" rel="noopener noreferrer">
            Facebook Event
          </a>
        </div>
        <ul className="comp-facts">
          {QUICK_FACTS.map(f => <li key={f}>{f}</li>)}
        </ul>
      </section>

      {/* Sponsors */}
      <section className="comp-section">
        <h2 className="comp-heading">Our Sponsors</h2>
        <div className="comp-sponsor-grid">
          {SPONSORS.map(s => (
            <a
              className="comp-sponsor-card"
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="comp-sponsor-logo">
                {s.logo
                  ? <img src={s.logo} alt={s.logoAlt} loading="lazy" />
                  : <span className="comp-sponsor-logo-text">{s.name}</span>}
              </div>
              <p className="comp-sponsor-blurb">{s.blurb}</p>
              <span className="comp-sponsor-link">{s.urlLabel}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Schedule */}
      <section className="compc-section">
        <h2 className="compc-heading">Schedule</h2>
        <div className="compc-sched">
          {SCHEDULE.map(block => {
            const [startTime, startAmPm] = block.time.split(' ')
            const rowClass = `compc-sched-row${block.highlight ? ' compc-sched-row--main' : ''}`
            const content = (
              <>
                <div className="compc-sched-time">
                  <span className="compc-sched-start">
                    {startTime}
                    <em>{startAmPm}</em>
                  </span>
                  {block.endTime && <span className="compc-sched-end">to {block.endTime}</span>}
                  <span className="compc-sched-icon"><SchedIcon name={block.icon} /></span>
                </div>
                <div className="compc-sched-body">
                  <h3>
                    {block.title}
                    {block.highlight && <span className="compc-sched-badge">Main Event</span>}
                  </h3>
                  <ul>
                    {block.items.map(item => <li key={item}>{item}</li>)}
                  </ul>
                  {block.anchor && <span className="compc-sched-more">See full details below</span>}
                </div>
              </>
            )
            return block.anchor ? (
              <a className={rowClass} href={`#${block.anchor}`} key={block.time}>
                {content}
              </a>
            ) : (
              <div className={rowClass} key={block.time}>
                {content}
              </div>
            )
          })}
        </div>
      </section>

      {/* Main events: alternating photo/text feature rows */}
      <section className="compc-section">
        <h2 className="compc-heading">Main Events</h2>
        {MAIN_EVENTS.map((ev, i) => (
          <article
            className={`compc-feature${i % 2 === 1 ? ' compc-feature--flip' : ''}`}
            id={ev.id}
            key={ev.title}
          >
            {ev.video !== undefined ? (
              <VideoEmbed url={ev.video} title={ev.title} />
            ) : (
              <Photo
                src={ev.image}
                alt={ev.imageAlt}
                prefix="compc"
                onClick={() => setLightbox({ src: ev.image, caption: ev.title })}
              />
            )}
            <div className="compc-feature-body">
              <p className="compc-feature-time">{ev.time}</p>
              <h3>{ev.title}</h3>
              <p className="compc-prize">Prize: {ev.prize}</p>
              <p className="compc-desc">{ev.desc}</p>
              <ol className="compc-rules">
                {ev.rules.map(rule => <li key={rule}>{rule}</li>)}
              </ol>
              {ev.showPrepVideos && (
                <>
                  <p className="compc-videos-label">Prepare with these how-to videos:</p>
                  <ul className="compc-videos">
                    {PREP_VIDEOS.map(v => (
                      <li key={v.url}>
                        <a href={v.url} target="_blank" rel="noopener noreferrer">{v.title}</a>
                        <span className="compc-video-tag">{v.tag}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </article>
        ))}
      </section>

      {/* Side contests */}
      <section className="comp-section">
        <h2 className="comp-heading">More Contests &amp; Prizes</h2>
        <div className="comp-contest-grid">
          {SIDE_CONTESTS.map(c => (
            <div className="comp-contest-card" key={c.title}>
              <Photo
                src={c.image}
                alt={c.imageAlt}
                prefix="comp"
                onClick={() => setLightbox({ src: c.image, caption: c.title })}
              />
              <h3>{c.title}</h3>
              {c.prize && <p className="comp-contest-prize">{c.prize}</p>}
              <ul>
                {c.details.map(d => <li key={d}>{d}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Activities */}
      <section className="comp-section">
        <h2 className="comp-heading">Interactive Activities &amp; Stations</h2>
        <p className="comp-section-sub">Explore these all day between competitions.</p>
        <div className="comp-activity-grid">
          {ACTIVITIES.map(a => (
            <div className="comp-activity" key={a.title}>
              <Photo
                src={a.image}
                alt={a.imageAlt}
                prefix="compc"
                onClick={() => setLightbox({ src: a.image, caption: a.title })}
              />
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </div>
          ))}
        </div>
        <p className="comp-bring">{BRING_LOCKS}</p>
      </section>

      {/* Event shop */}
      <section className="comp-section">
        <div className="comp-shop-panel">
          <h2 className="comp-shop-heading">Event Shop</h2>
          <p className="comp-shop-sub">Take home your own gear - for sale during the event.</p>
          <div className="comp-shop-grid">
            {SALE_ITEMS.map(item => (
              <div className="comp-shop-card" key={item.title}>
                <Photo
                  src={item.image}
                  alt={item.imageAlt}
                  prefix="compc"
                  onClick={() => setLightbox({ src: item.image, caption: item.title })}
                />
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                {item.price && <span className="comp-shop-price">{item.price}</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="comp-final">
        <h2 className="comp-heading">See You There</h2>
        <p>
          Prizes and more competition details will be announced as the event gets closer.
          We hope to see you for an awesome day of locksport, learning, and friendly competition!
        </p>
        <div className="comp-cta-row">
          <a className="comp-cta comp-cta--meetup" href={EVENT.meetupUrl} target="_blank" rel="noopener noreferrer">
            RSVP on Meetup
          </a>
          <a className="comp-cta comp-cta--facebook" href={EVENT.facebookUrl} target="_blank" rel="noopener noreferrer">
            Facebook Event
          </a>
        </div>
      </section>

      {/* Enlarged image lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">
              <CloseIcon />
            </button>
            <img src={lightbox.src} alt={lightbox.caption} />
            <div className="lightbox-meta">
              <span className="lightbox-caption">{lightbox.caption}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Photo({ src, alt, prefix, onClick }: {
  src: string
  alt: string
  prefix: 'comp' | 'compc'
  onClick?: () => void
}) {
  if (src) {
    return (
      <div
        className={`${prefix}-photo${onClick ? ` ${prefix}-photo--clickable` : ''}`}
        onClick={onClick}
      >
        <img src={src} alt={alt} loading="lazy" />
      </div>
    )
  }
  return (
    <div className={`${prefix}-photo ${prefix}-photo--empty`} aria-hidden="true">
      <CameraIcon />
      <span>Photo coming soon</span>
    </div>
  )
}

function youTubeEmbedSrc(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/
  )
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

function VideoEmbed({ url, title }: { url: string; title: string }) {
  const embedSrc = url ? youTubeEmbedSrc(url) : null

  if (embedSrc) {
    return (
      <div className="compc-video-embed">
        <iframe
          src={embedSrc}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    )
  }
  return (
    <div className="compc-video-embed compc-video-embed--empty" aria-hidden="true">
      <PlayIcon />
      <span>Video coming soon</span>
    </div>
  )
}

function SchedIcon({ name }: { name: ScheduleIcon }) {
  const paths: Record<ScheduleIcon, string> = {
    // door with knob
    door: 'M19 19V5c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v14H3v2h18v-2h-2zm-4-6h-2v-2h2v2z',
    // key
    pick: 'M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z',
    // fork and knife
    food: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z',
    // open padlock
    escape: 'M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5-2.28 0-4.27 1.54-4.84 3.75l1.94.5C9.44 3.93 10.63 3 12 3c1.65 0 3 1.35 3 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z',
    // trophy
    trophy: 'M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z',
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM9 3l-1.83 2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.17L15 3H9zm3 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}
