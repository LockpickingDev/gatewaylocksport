export async function pushToGoogleCalendar(event: {
  name: string
  date: string
  time: string
  location: string
  description: string
}): Promise<boolean> {
  try {
    const response = await fetch('/api/push-calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    })

    if (!response.ok) {
      const text = await response.text()
      let err: unknown
      try { err = JSON.parse(text) } catch { err = text }
      console.error('Calendar push error:', err)
      return false
    }

    return true
  } catch (err) {
    console.error('Calendar push failed:', err)
    return false
  }
}