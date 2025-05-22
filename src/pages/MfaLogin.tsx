// src/pages/MfaLogin.tsx
import { useState, FormEvent, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Spinner } from '../components/Spinner'

interface LocationState {
  email: string
}

export default function MfaLogin() {
  const { mfaLogin, loading, error } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState | undefined

  const [code, setCode] = useState('')

  // if someone hits this page without coming from login, redirect
  useEffect(() => {
    if (!state?.email) navigate('/login', { replace: true })
  }, [state, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await mfaLogin(state!.email, code)
  }

  if (loading) return <Spinner />

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">
        MFA Verification
      </h1>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">
            Please enter the 6-digit code from your authenticator app
          </label>
          <input
            type="text"
            maxLength={6}
            className="w-full border rounded px-3 py-2"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Verify & Login
        </button>
      </form>
    </div>
  )
}
