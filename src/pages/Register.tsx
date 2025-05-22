// src/pages/Register.tsx
import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { register as apiRegister } from '../services/api'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const errs: Record<string,string> = {}
    if (!name.trim()) errs.name = 'Name is required.'
    // ... your existing email & password checks ...
    if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords don't match."
    }
    return errs
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setServerError('')
    const v = validate()
    if (Object.keys(v).length) {
      setErrors(v)
      return
    }
    setSubmitting(true)
    try {
      //  Pass confirmPassword into the API call
      await apiRegister(name, email, password, confirmPassword)
      alert('Registration successful! Please verify your email before logging in.')
      navigate('/login')
    } catch (err: any) {
      setServerError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Register for Kolik</h1>

      {serverError && (
        <div className="mb-4 text-red-700 bg-red-100 p-2 rounded">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block mb-1">Confirm Password</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Terms & Submit */}
        <p className="text-sm text-gray-600">
          By signing up, you agree to our{' '}
          <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
          <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {submitting ? 'Registering…' : 'Register'}
        </button>
      </form>
    </div>
  )
}
