// src/pages/VerifyEmail.tsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { verifyEmail } from '../services/api'
import { Spinner } from '../components/Spinner'
import { useAuth } from '../contexts/AuthContext'

export default function VerifyEmail() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setError('No verification token provided.')
      setLoading(false)
      return
    }

    ;(async () => {
      try {
        // 1) Hit the verify-email endpoint
        const data = await verifyEmail(token)
        setMessage(data.message || 'Your email has been verified!')

        // 2) Clear any existing auth state
        await logout()

      } catch (err: any) {
        setError(err.message || 'Verification failed.')
      } finally {
        setLoading(false)
        // 3) Redirect to login after a short pause
        setTimeout(() => navigate('/login', { replace: true }), 3000)
      }
    })()
  }, [token, logout, navigate])

  if (loading) return <Spinner />

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow text-center">
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          <p className="text-green-700 mb-4">{message}</p>
          <p>You’ll be redirected to <strong>Log In</strong> in a moment.</p>
        </>
      )}
    </div>
  )
}
