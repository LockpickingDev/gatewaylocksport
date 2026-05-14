import { useState, useEffect } from 'react'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Event } from '../types'

interface UseEventsResult {
  events: Event[]
  loading: boolean
  error: string | null
}

export function useEvents(): UseEventsResult {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const q = query(
          collection(db, 'Events'),
          orderBy('date', 'asc')
        )
        const snapshot = await getDocs(q)
        const fetched = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Event[]
        setEvents(fetched)
      } catch (err) {
        console.error('Error fetching events:', err)
        setError('Failed to load events. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  return { events, loading, error }
}