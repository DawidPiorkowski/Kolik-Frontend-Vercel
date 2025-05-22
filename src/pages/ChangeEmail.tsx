import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { requestEmailChange } from '../services/api'

const ChangeEmail: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [mfaCode, setMfaCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string|null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      await requestEmailChange({ current_password: currentPassword, new_email: newEmail, mfa_code: mfaCode })
      setMessage('Check your new email inbox for the confirmation link.')
      // optionally navigate away:
      // navigate('/')
    } catch (err: any) {
      setMessage(err.message || 'Failed to request email change.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Change Email</h2>
      {message && <div className="p-2 bg-green-100 text-green-800">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label>New Email</label>
          <input
            type="email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label>MFA Code</label>
          <input
            type="text"
            value={mfaCode}
            onChange={e => setMfaCode(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Sending…' : 'Request Change'}
        </button>
      </form>
    </div>
  )
}

export default ChangeEmail
