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

export interface GalleryPhoto {
  id: string
  url: string
  caption: string
  uploadDate: string
  uploadedAt: number
  year: number
  fileName: string
}