// src/pages/PasswordResetConfirm.tsx
import { useState, useEffect, FormEvent } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { resetPassword } from '../services/api'
import { Spinner } from '../components/Spinner'

export default function PasswordResetConfirm() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // If no token in URL, show error
  useEffect(() => {
    if (!token) setError('No reset token provided.')
  }, [token])

  const validate = () => {
    if (password.length < 10) return 'At least 10 characters.'
    if (!/[A-Z]/.test(password)) return 'One uppercase letter required.'
    if (!/[a-z]/.test(password)) return 'One lowercase letter required.'
    if (!/\d/.test(password)) return 'One number required.'
    if (!/[^A-Za-z0-9]/.test(password)) return 'One special character required.'
    if (password !== confirm) return "Passwords don't match."
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const vErr = validate()
    if (vErr) {
      setError(vErr)
      return
    }

    setLoading(true)
    try {
      // send token, new_password, AND confirm_password
      await resetPassword(token, password, confirm)
      setSuccess(true)
      setTimeout(() => navigate('/login', { replace: true }), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Spinner />

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow text-center">
        <p className="text-green-700 mb-2">Password reset successful!</p>
        <p>Redirecting you to Log In…</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Set New Password</h1>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">New Password</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Confirm Password</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Set Password
        </button>
      </form>
    </div>
  )
}
