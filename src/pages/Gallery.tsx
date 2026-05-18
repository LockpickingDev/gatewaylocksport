import { useState, useEffect } from 'react'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { GalleryPhoto } from '../types'
import './Gallery.css'

export default function Gallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null)

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const q = query(collection(db, 'Gallery'), orderBy('uploadedAt', 'desc'))
        const snapshot = await getDocs(q)
        const fetched = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as GalleryPhoto[]
        setPhotos(fetched)
      } catch (err) {
        console.error('Error fetching gallery:', err)
        setError('Failed to load photos.')
      } finally {
        setLoading(false)
      }
    }
    fetchPhotos()
  }, [])

  const byYear = photos.reduce<Record<number, GalleryPhoto[]>>((acc, photo) => {
    if (!acc[photo.year]) acc[photo.year] = []
    acc[photo.year].push(photo)
    return acc
  }, {})

  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a)

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="gallery-page">
      <section className="gallery-hero">
        <div className="section-label">Community</div>
        <div className="section-title">Photo Gallery</div>
        <p className="gallery-hero-sub">
          A look at our community in action.
        </p>
      </section>

      <section className="gallery-section">
        {loading && <p className="gallery-status">Loading photos...</p>}
        {error && <p className="gallery-status error">{error}</p>}
        {!loading && !error && photos.length === 0 && (
          <p className="gallery-status">No photos yet. Check back after our next meetup!</p>
        )}
        {!loading && !error && years.map(year => (
          <div key={year} className="gallery-year-group">
            <div className="gallery-year-label">{year}</div>
            <div className="gallery-grid">
              {byYear[year].map(photo => (
                <div
                  key={photo.id}
                  className="gallery-item"
                  onClick={() => setLightboxPhoto(photo)}
                >
                  <img src={photo.url} alt={photo.caption || 'Gateway Locksport event photo'} loading="lazy" />
                  {(photo.caption || photo.uploadDate) && (
                    <div className="gallery-overlay">
                      {photo.uploadDate && (
                        <span className="gallery-date">{formatDate(photo.uploadDate)}</span>
                      )}
                      {photo.caption && (
                        <span className="gallery-caption">{photo.caption}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {lightboxPhoto && (
        <div className="lightbox" onClick={() => setLightboxPhoto(null)}>
          <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxPhoto(null)} aria-label="Close">
              <CloseIcon />
            </button>
            <img src={lightboxPhoto.url} alt={lightboxPhoto.caption || 'Gateway Locksport event photo'} />
            {(lightboxPhoto.caption || lightboxPhoto.uploadDate) && (
              <div className="lightbox-meta">
                {lightboxPhoto.uploadDate && (
                  <span className="lightbox-date">{formatDate(lightboxPhoto.uploadDate)}</span>
                )}
                {lightboxPhoto.caption && (
                  <span className="lightbox-caption">{lightboxPhoto.caption}</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  )
}