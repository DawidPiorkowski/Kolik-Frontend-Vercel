import { useState, FormEvent } from 'react'
import { requestPasswordReset } from '../services/api'
import { Spinner } from '../components/Spinner'

export default function PasswordResetRequest() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await requestPasswordReset(email)
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow text-center">
      {submitted ? (
        <p className="text-green-700">
          If that email exists, you’ll receive a password reset link shortly.
        </p>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Email Address</label>
              <input
                type="email"
                className="w-full border rounded p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Send Reset Link
            </button>
          </form>
        </>
      )}
    </div>
  )
}
