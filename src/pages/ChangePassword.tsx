import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { changePassword } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [mfaCode, setMfaCode] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      alert('New password and confirmation do not match.')
      return
    }

    setLoading(true)

    // 1) First, try changing the password
    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_new_password: confirmPassword,
        mfa_code: mfaCode,
      })
    } catch (err: any) {
      console.error('Password change error:', err)
      const msg =
        err.response?.data?.detail ||
        'Failed to change password. Please try again.'
      alert(msg)
      setLoading(false)
      return
    }

    // 2) On success, notify user
    alert('Password changed successfully. Please log in with your new credentials.')

    // 3) Then log out (errors here are non-blocking)
    try {
      await logout()
    } catch (warnErr) {
      console.warn('Logout after password change failed (ignored):', warnErr)
    }

    // 4) Redirect and clear loading
    navigate('/login')
    setLoading(false)
  } // end handleSubmit

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="mfaCode" className="block text-sm font-medium mb-1">
            MFA Code
          </label>
          <input
            id="mfaCode"
            type="text"
            value={mfaCode}
            onChange={e => setMfaCode(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Updating…' : 'Change Password'}
        </button>
      </form>
    </div>
  )
}

export default ChangePassword
