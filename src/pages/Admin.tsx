/// <reference types="@types/google.maps" />
import { useRef, useState, useEffect } from 'react'
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth'
import { collection, addDoc, getDocs, orderBy, query, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { auth, googleProvider, db } from '../lib/firebase'
import { pushToGoogleCalendar } from '../lib/calendar'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '../lib/firebase'
import type { GalleryPhoto } from '../types'
import type { Event } from '../types'
import './Admin.css'

const ALLOWED_EMAIL = 'gatewaylocksport@gmail.com'

export default function Admin() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        if (user.email === ALLOWED_EMAIL) {
          setUserEmail(user.email)
          setAccessDenied(false)
        } else {
          signOut(auth)
          setAccessDenied(true)
        }
      } else {
        setUserEmail(null)
      }
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  async function handleSignIn() {
    setAccessDenied(false)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const credential = GoogleAuthProvider.credentialFromResult(result)
      if (credential?.accessToken) {
      }
    } catch (err) {
      console.error('Sign in error:', err)
    }
  }

  async function handleSignOut() {
    await signOut(auth)
  }

  if (authLoading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">Verifying access...</div>
      </div>
    )
  }

  if (!userEmail) {
    return (
      <div className="admin-page">
        <div className="admin-login-wrap">
          <div className="admin-login-card">
            <LockIcon />
            <h1>Admin Access</h1>
            <p>Sign in with the Gateway Locksport Google account to continue.</p>
            {accessDenied && (
              <div className="access-denied">
                Access denied. Only the Gateway Locksport account may sign in here.
              </div>
            )}
            <button className="btn-google" onClick={handleSignIn}>
              <GoogleIcon />
              Sign in with Google
            </button>
            <div className="admin-security-note">
              This page is not linked anywhere on the public site.
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <AdminDashboard
        userEmail={userEmail}
        onSignOut={handleSignOut}
      />
    </div>
  )
}

function AdminDashboard({ userEmail, onSignOut }: { userEmail: string; onSignOut: () => void }) {
  const [events, setEvents] = useState<Event[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [form, setForm] = useState({
    name: '',
    date: '',
    time: '18:00',
    location: '',
    mapsUrl: '',
    description: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    try {
      const q = query(collection(db, 'Events'), orderBy('date', 'desc'))
      const snapshot = await getDocs(q)
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[]
      setEvents(fetched)
    } catch (err) {
      console.error('Error fetching events:', err)
    } finally {
      setLoadingEvents(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement| HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (name === 'location') {
      const mapsUrl = 'https://maps.google.com/?q=' + encodeURIComponent(value)
      setForm(prev => ({ ...prev, location: value, mapsUrl }))
    }
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setImageFile(file)
    setImagePreview(file ? URL.createObjectURL(file) : null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    setSuccessMsg('')

    if (!form.name || !form.date || !form.time || !form.location || !form.description) {
      setFormError('All fields are required.')
      return
    }

    setSubmitting(true)
    try {
      const year = parseInt(form.date.split('-')[0])
      const emailDate = new Date(form.date + 'T12:00:00')
      emailDate.setDate(emailDate.getDate() - 3)
      const emailSendDate = emailDate.toISOString().split('T')[0]

      let imageUrl = ''
      let imageName = ''
      if (imageFile) {
        imageName = `events/${Date.now()}-${imageFile.name}`
        const storageRef = ref(storage, imageName)
        await uploadBytes(storageRef, imageFile)
        imageUrl = await getDownloadURL(storageRef)
      }

      await addDoc(collection(db, 'Events'), {
        name: form.name,
        date: form.date,
        time: form.time,
        location: form.location,
        mapsUrl: form.mapsUrl,
        description: form.description,
        year,
        createdAt: new Date().toISOString().split('T')[0],
        emailSendDate,
        imageUrl,
        imageName
      })

      const calendarSuccess = await pushToGoogleCalendar({
        name: form.name,
        date: form.date,
        time: form.time,
        location: form.location,
        description: form.description
      })

      const calendarMsg = calendarSuccess
        ? 'Event created · Calendar updated · Reminder email queued for ' + emailSendDate
        : 'Event saved · Calendar push failed — check console · Email queued for ' + emailSendDate

      setSuccessMsg(calendarMsg)
      setForm({ name: '', date: '', time: '18:00', location: '', mapsUrl: '', description: '' })
      setImageFile(null)
      setImagePreview(null)
      fetchEvents()
    } catch (err) {
      console.error('Error creating event:', err)
      setFormError('Failed to save event. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <div className="admin-label">Restricted Access</div>
          <h1 className="admin-title">Admin Dashboard</h1>
        </div>
        <div className="admin-header-right">
          <span className="admin-user">{userEmail}</span>
          <button className="btn-signout" onClick={onSignOut}>Sign Out</button>
        </div>
      </div>

      <div className="admin-body">
        <section className="admin-card">
          <h2 className="admin-card-title">Create New Event</h2>

          <div className="status-badges">
            <span className="status-badge green">Firestore save</span>
            <span className="status-badge green">Google Calendar push</span>
            <span className="status-badge amber">Resend email — 3 days before</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="admin-form-group">
                <label htmlFor="name">Event name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="August Lock Meetup"
                />
              </div>
              <div className="admin-form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="time">Time</label>
              <select
                id="time"
                name="time"
                value={form.time}
                onChange={handleChange as React.ChangeEventHandler<HTMLSelectElement>}
              >
                <option value="">Select a time</option>
                {Array.from({ length: 24 * 12 }, (_, i) => {
                  const totalMinutes = i * 5
                  const hours = Math.floor(totalMinutes / 60)
                  const minutes = totalMinutes % 60
                  const ampm = hours < 12 ? 'AM' : 'PM'
                  const displayHours = hours % 12 === 0 ? 12 : hours % 12
                  const displayMinutes = minutes.toString().padStart(2, '0')
                  const value = `${hours.toString().padStart(2, '0')}:${displayMinutes}`
                  const label = `${displayHours}:${displayMinutes} ${ampm}`
                  return (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                })}
              </select>
            </div>

            <div className="admin-form-group">
              <label htmlFor="location">Location</label>
              <LocationAutocomplete
                value={form.location}
                onChange={(address, mapsUrl) =>
                  setForm(prev => ({ ...prev, location: address, mapsUrl }))
                }
              />
              <span className="admin-field-hint">
                Select an address from the dropdown to generate a Google Maps link automatically
              </span>
            </div>

            <div className="admin-form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="What will happen at this event?"
                rows={4}
              />
            </div>

            <div className="admin-form-group">
              <label>Event image (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ color: '#E8E0D0' }}
              />
              {imagePreview && (
                <div className="event-image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    type="button"
                    className="btn-admin-ghost"
                    onClick={() => { setImageFile(null); setImagePreview(null) }}
                    style={{ fontSize: '0.72rem', padding: '0.3rem 0.75rem' }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {formError && <div className="admin-error">{formError}</div>}
            {successMsg && <div className="admin-success">{successMsg}</div>}

            <button type="submit" className="btn-admin" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish Event'}
            </button>
          </form>
        </section>

        <section className="admin-card">
          <h2 className="admin-card-title">Existing Events</h2>
          {loadingEvents ? (
            <p className="admin-meta">Loading...</p>
          ) : events.length === 0 ? (
            <p className="admin-meta">No events yet.</p>
          ) : (
            <div className="admin-event-list">
              {events.map(event => (
                <div key={event.id} className="admin-event-row">
                  <div className="admin-event-info">
                    <span className="admin-event-name">{event.name}</span>
                    <span className="admin-event-date">{event.date} · {event.time}</span>
                  </div>
                  <EventImageManager
                    event={event}
                    onUpdate={updated => setEvents(prev => prev.map(e => e.id === updated.id ? updated : e))}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="admin-card">
          <h2 className="admin-card-title">Gallery Photos</h2>
          <GalleryUploader />
        </section>
      </div>
    </div>
  )
}

function EventImageManager({ event, onUpdate }: { event: Event; onUpdate: (updated: Event) => void }) {
  const [editing, setEditing] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setImageFile(file)
    setImagePreview(file ? URL.createObjectURL(file) : null)
  }

  function cancelEdit() {
    setEditing(false)
    setImageFile(null)
    setImagePreview(null)
  }

  async function handleSave() {
    if (!imageFile) return
    setSaving(true)
    try {
      if (event.imageName) {
        try { await deleteObject(ref(storage, event.imageName)) } catch {}
      }
      const imageName = `events/${Date.now()}-${imageFile.name}`
      const storageRef = ref(storage, imageName)
      await uploadBytes(storageRef, imageFile)
      const imageUrl = await getDownloadURL(storageRef)
      await updateDoc(doc(db, 'Events', event.id), { imageUrl, imageName })
      onUpdate({ ...event, imageUrl, imageName })
      cancelEdit()
    } catch (err) {
      console.error('Error updating event image:', err)
    } finally {
      setSaving(false)
    }
  }

  async function handleRemove() {
    if (!confirm('Remove this event image?')) return
    setSaving(true)
    try {
      if (event.imageName) {
        try { await deleteObject(ref(storage, event.imageName)) } catch {}
      }
      await updateDoc(doc(db, 'Events', event.id), { imageUrl: '', imageName: '' })
      onUpdate({ ...event, imageUrl: '', imageName: '' })
    } catch (err) {
      console.error('Error removing event image:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="event-image-manager">
      {event.imageUrl && !editing && (
        <img src={event.imageUrl} alt={event.name} className="event-image-manager-thumb" />
      )}

      {editing ? (
        <div className="event-image-edit">
          <input type="file" accept="image/*" onChange={handleSelect} style={{ color: '#E8E0D0', fontSize: '0.78rem' }} />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="event-image-manager-thumb" style={{ marginTop: '0.4rem' }} />
          )}
          <div className="gallery-caption-actions">
            <button className="btn-admin" onClick={handleSave} disabled={!imageFile || saving} style={{ fontSize: '0.72rem', padding: '0.3rem 0.75rem' }}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button className="btn-admin-ghost" onClick={cancelEdit} style={{ fontSize: '0.72rem', padding: '0.3rem 0.75rem' }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="gallery-caption-actions">
          <button className="btn-admin-ghost" onClick={() => setEditing(true)} style={{ fontSize: '0.72rem', padding: '0.3rem 0.75rem' }}>
            {event.imageUrl ? 'Change' : 'Add image'}
          </button>
          {event.imageUrl && (
            <button className="gallery-admin-delete" onClick={handleRemove} disabled={saving}>
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function LockIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function LocationAutocomplete({
  value,
  onChange
}: {
  value: string
  onChange: (address: string, mapsUrl: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  useEffect(() => {
    if (!inputRef.current || !window.google) return

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ['address'],
        componentRestrictions: { country: 'us' }
      }
    )

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace()
      if (!place?.formatted_address) return
      const address = place.formatted_address
      const mapsUrl = 'https://maps.google.com/?q=' + encodeURIComponent(address)
      onChange(address, mapsUrl)
    })

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [])

  return (
    <input
      ref={inputRef}
      type="text"
      id="location"
      name="location"
      defaultValue={value}
      placeholder="2100 Locust St, St. Louis, MO 63103"
      className="pac-input"
    />
  )
}

function GalleryUploader() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [captions, setCaptions] = useState<Record<number, string>>({})
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')
  const [existingPhotos, setExistingPhotos] = useState<GalleryPhoto[]>([])
  const [loadingPhotos, setLoadingPhotos] = useState(true)
  const [editingCaption, setEditingCaption] = useState<Record<string, string>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [savingCaption, setSavingCaption] = useState(false)

  useEffect(() => {
    fetchGalleryPhotos()
  }, [])

  async function fetchGalleryPhotos() {
    try {
      const q = query(collection(db, 'Gallery'), orderBy('uploadedAt', 'desc'))
      const snapshot = await getDocs(q)
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryPhoto[]
      setExistingPhotos(fetched)
    } catch (err) {
      console.error('Error fetching gallery photos:', err)
    } finally {
      setLoadingPhotos(false)
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 15)
    setSelectedFiles(files)
    setCaptions({})
  }

  async function handleUpload() {
    if (selectedFiles.length === 0) return
    setUploading(true)
    setUploadMsg('')

    try {
      const uploadDate = new Date().toISOString().split('T')[0]
      const year = new Date().getFullYear()

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const fileName = `gallery/${Date.now()}-${file.name}`
        const storageRef = ref(storage, fileName)
        await uploadBytes(storageRef, file)
        const url = await getDownloadURL(storageRef)
        const uploadedAt = Date.now() + i //Add index to ensure upload ordering 

        await addDoc(collection(db, 'Gallery'), {
          url,
          caption: captions[i] || '',
          uploadDate,
          uploadedAt,
          year,
          fileName
        })
      }

      setUploadMsg(`${selectedFiles.length} photo${selectedFiles.length !== 1 ? 's' : ''} uploaded successfully`)
      setSelectedFiles([])
      setCaptions({})
      fetchGalleryPhotos()
    } catch (err) {
      console.error('Upload error:', err)
      setUploadMsg('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  function startEditingCaption(photo: GalleryPhoto) {
    setEditingId(photo.id)
    setEditingCaption(prev => ({ ...prev, [photo.id]: photo.caption || '' }))
  }

  function cancelEditingCaption() {
    setEditingId(null)
  }

  async function saveCaption(photoId: string) {
    setSavingCaption(true)
    try {
      await updateDoc(doc(db, 'Gallery', photoId), {
        caption: editingCaption[photoId] || ''
      })
      setExistingPhotos(prev =>
        prev.map(p => p.id === photoId
          ? { ...p, caption: editingCaption[photoId] || '' }
          : p
        )
      )
      setEditingId(null)
    } catch (err) {
      console.error('Error saving caption:', err)
    } finally {
      setSavingCaption(false)
    }
  }

  async function handleDelete(photo: GalleryPhoto) {
    if (!confirm('Delete this photo?')) return
    try {
      const storageRef = ref(storage, photo.fileName)
      await deleteObject(storageRef)
      await deleteDoc(doc(db, 'Gallery', photo.id))
      setExistingPhotos(prev => prev.filter(p => p.id !== photo.id))
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  return (
    <div>
      <div className="admin-form-group">
        <label>Select photos (up to 15)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          style={{ color: '#E8E0D0' }}
        />
      </div>

      {selectedFiles.length > 0 && (
        <div>
          <div className="gallery-preview-grid">
            {selectedFiles.map((file, i) => (
              <div key={i} className="gallery-preview-item">
                <img src={URL.createObjectURL(file)} alt={file.name} />
                <input
                  className="admin-input"
                  type="text"
                  placeholder="Optional caption"
                  value={captions[i] || ''}
                  onChange={e => setCaptions(prev => ({ ...prev, [i]: e.target.value }))}
                  style={{ marginTop: '0.5rem', fontSize: '0.78rem', padding: '0.4rem 0.6rem' }}
                />
              </div>
            ))}
          </div>

          <button
            className="btn-admin"
            onClick={handleUpload}
            disabled={uploading}
            style={{ marginTop: '1rem' }}
          >
            {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} photo${selectedFiles.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      )}

      {uploadMsg && (
        <div
          className={uploadMsg.includes('failed') ? 'admin-error' : 'admin-success'}
          style={{ marginTop: '0.75rem' }}
        >
          {uploadMsg}
        </div>
      )}

      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7A6328', marginBottom: '0.75rem' }}>
          Existing photos ({existingPhotos.length})
        </div>

        {loadingPhotos ? (
          <p className="admin-meta">Loading...</p>
        ) : existingPhotos.length === 0 ? (
          <p className="admin-meta">No photos uploaded yet.</p>
        ) : (
          <div className="gallery-admin-grid">
            {existingPhotos.map(photo => (
              <div key={photo.id} className="gallery-admin-item">
                <img src={photo.url} alt={photo.caption || 'gallery photo'} />

                <div className="gallery-admin-meta">
                  <span>{photo.uploadDate}</span>
                  {photo.caption && editingId !== photo.id && (
                    <span className="gallery-admin-caption">{photo.caption}</span>
                  )}
                </div>

                {editingId === photo.id ? (
                  <div className="gallery-caption-edit">
                    <input
                      className="admin-input"
                      type="text"
                      placeholder="Add a caption..."
                      value={editingCaption[photo.id] || ''}
                      onChange={e => setEditingCaption(prev => ({
                        ...prev,
                        [photo.id]: e.target.value
                      }))}
                      style={{ fontSize: '0.78rem', padding: '0.4rem 0.6rem', marginBottom: '0.4rem' }}
                      autoFocus
                    />
                    <div className="gallery-caption-actions">
                      <button
                        className="btn-admin"
                        onClick={() => saveCaption(photo.id)}
                        disabled={savingCaption}
                        style={{ fontSize: '0.72rem', padding: '0.3rem 0.75rem' }}
                      >
                        {savingCaption ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        className="btn-admin-ghost"
                        onClick={cancelEditingCaption}
                        style={{ fontSize: '0.72rem', padding: '0.3rem 0.75rem' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="gallery-caption-actions">
                    <button
                      className="btn-admin-ghost"
                      onClick={() => startEditingCaption(photo)}
                      style={{ fontSize: '0.72rem', padding: '0.3rem 0.75rem' }}
                    >
                      {photo.caption ? 'Edit caption' : 'Add caption'}
                    </button>
                    <button
                      className="gallery-admin-delete"
                      onClick={() => handleDelete(photo)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}