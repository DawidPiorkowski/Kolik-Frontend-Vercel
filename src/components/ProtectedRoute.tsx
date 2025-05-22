// src/components/ProtectedRoute.tsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Spinner } from './Spinner'

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()

  if (loading) {
    // still checking the cookie → show a spinner
    return <Spinner />
  }
  if (!user) {
    // no session → kick back to login
    return <Navigate to="/login" replace />
  }
  // ✅ we have a user
  return <>{children}</>
}
