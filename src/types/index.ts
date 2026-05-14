export interface Event {
  id: string
  name: string
  date: string
  time: string
  location: string
  mapsUrl: string
  description: string
  year: number
  createdAt: string
}

export interface Subscriber {
  id: string
  firstName: string
  email: string
  subscribedAt: string
  confirmed: boolean
}