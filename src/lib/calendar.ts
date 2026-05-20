export async function pushToGoogleCalendar(
  event: { name: string; date: string; time: string; location: string; description: string },
  idToken: string
): Promise<string | null> {
  try {
    const response = await fetch('/api/push-calendar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify(event)
    })

    if (!response.ok) {
      const text = await response.text()
      let err: unknown
      try { err = JSON.parse(text) } catch { err = text }
      console.error('Calendar push error:', err)
      return null
    }

    const data = await response.json()
    return data.calendarEventId ?? null
  } catch (err) {
    console.error('Calendar push failed:', err)
    return null
  }
}

export async function deleteFromGoogleCalendar(
  calendarEventId: string,
  idToken: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/delete-calendar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ calendarEventId })
    })

    if (!response.ok) {
      const text = await response.text()
      let err: unknown
      try { err = JSON.parse(text) } catch { err = text }
      console.error('Calendar delete error:', err)
      return false
    }

    return true
  } catch (err) {
    console.error('Calendar delete failed:', err)
    return false
  }
}
