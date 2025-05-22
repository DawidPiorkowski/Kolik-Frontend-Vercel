// src/pages/MfaSetup.tsx

import React, { useState, useEffect, FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getMfaSetup, verifyMfa } from '../services/api'
import { Spinner } from '../components/Spinner'

interface LocationState {
  email?: string
}

export default function MfaSetup() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | undefined
  const email = state?.email

  // redirect to login if someone hits this page without an email in state
  useEffect(() => {
    if (!email) navigate('/login', { replace: true })
  }, [email, navigate])

  const [qrCode, setQrCode] = useState<string>('')
  const [secret, setSecret] = useState<string>('')
  const [code, setCode] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const payload = await getMfaSetup()
        console.log('🔍 MFA setup payload:', payload)

        // backend returns base64 under `qr_code_base64`
        const b64 = (payload as any).qr_code_base64
        if (!b64) {
          throw new Error(
            `No qr_code_base64 field in payload (got keys: ${Object.keys(
              payload
            ).join(', ')})`
          )
        }

        setQrCode(b64)
        setSecret((payload as any).secret || '')
      } catch (err: any) {
        console.error('getMfaSetup error:', err)
        setError(err.message || 'Failed to load QR code')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await verifyMfa(code)      // now sends X-CSRFToken under the hood
      navigate('/products', { replace: true })
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded shadow">
      <h1 className="text-xl font-bold mb-4 text-center">MFA Setup</h1>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <p className="mb-4 text-center">
        Scan this QR code in your Authenticator app:
      </p>

      <div className="flex justify-center mb-4">
        {qrCode ? (
          <img
            src={`data:image/png;base64,${qrCode}`}
            alt="MFA QR code"
            className="border p-2 bg-white"
          />
        ) : (
          <p className="text-gray-500">Unable to render QR code.</p>
        )}
      </div>

      <p className="mb-4 text-sm text-gray-600 text-center">
        (Secret: <code>{secret}</code>)
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Enter 6-digit code</label>
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
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Verify &amp; Finish Setup
        </button>
      </form>
    </div>
  )
}
