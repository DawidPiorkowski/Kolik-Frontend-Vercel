// src/pages/AccountSettings.tsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProfile, updateProfile } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const AccountSettings: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string|null>(null)
  const { logout } = useAuth()

  // Load profile on mount
  useEffect(() => {
    getProfile()
      .then(data => {
        setName(data.name)
        setEmail(data.email)
      })
      .catch(err => {
        console.error(err)
        // maybe session expired?
        if (err.message.includes('401')) logout()
      })
      .finally(() => setLoading(false))
  }, [logout])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      await updateProfile({ name })
      setMessage('Profile updated successfully.')
    } catch (err: any) {
      console.error(err)
      setMessage(err.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading your profile…</div>
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-semibold">Your Account Settings</h1>

      {message && (
        <div className="p-3 bg-green-100 text-green-800 rounded">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            readOnly
            className="w-full bg-gray-100 border border-gray-300 rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </form>

      <div className="border-t pt-4 space-y-2">
        <Link
          to="/account/change-password"
          className="block text-blue-600 hover:underline"
        >
          Change Password
        </Link>
        <Link
          to="/account/change-email"
          className="block text-blue-600 hover:underline"
        >
          Change Email
        </Link>
      </div>
    </div>
  )
}

export default AccountSettings
