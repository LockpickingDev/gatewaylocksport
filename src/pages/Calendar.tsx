import './Calendar.css'

export default function Calendar() {
  return (
    <div className="calendar-page">
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

        <div className="calendar-note">
          <strong>Can't see the calendar?</strong> Make sure the Gateway Locksport Google Calendar
          is set to public in Google Calendar settings. Go to Settings → your calendar →
          Access permissions → check "Make available to public".
        </div>
      </section>
    </div>
  )
}