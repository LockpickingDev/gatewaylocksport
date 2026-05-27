import SEO from '../components/SEO'
import './Calendar.css'

export default function Calendar() {
  return (
    <div className="calendar-page">
      <SEO
        title="Event Calendar"
        description="View the Gateway Locksport event calendar. We host free monthly lockpicking meetups in St. Louis and St. Charles, Missouri — open to all skill levels."
        canonical="/calendar"
      />
      <section className="calendar-hero">
        <div className="section-label">Schedule</div>
        <div className="section-title">Event Calendar</div>
      </section>

      <section className="calendar-section">
        <div className="calendar-embed">
          <iframe
            src="https://calendar.google.com/calendar/embed?src=GatewayLocksport%40gmail.com&ctz=America%2FChicago"
            style={{ border: 0 }}
            width="100%"
            height="600"
            frameBorder="0"
            scrolling="no"
            title="Gateway Locksport Event Calendar"
          />
        </div>
      </section>
    </div>
  )
}