// src/App.tsx
import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import {
  fetchCsrfToken // ← import this
} from './services/config' 

import Home                  from './pages/Home'
import Login                 from './pages/Login'
import Register              from './pages/Register'
import VerifyEmail           from './pages/VerifyEmail'
import PasswordResetRequest  from './pages/PasswordResetRequest'
import PasswordResetConfirm  from './pages/PasswordResetConfirm'
import MfaSetup              from './pages/MfaSetup'
import MfaLogin              from './pages/MfaLogin'
import Products              from './pages/Products'
import ProductDetail         from './pages/ProductDetail'
import ShoppingList          from './pages/ShoppingList'
import ProtectedTest         from './pages/ProtectedTest'

// Profile 
import AccountSettings       from './pages/AccountSettings'
import ChangePassword        from './pages/ChangePassword'
import ChangeEmail           from './pages/ChangeEmail'
import ConfirmEmail          from './pages/ConfirmEmail'

import ProtectedRoute from './components/ProtectedRoute'
import Navbar         from './components/Navbar'
import Layout         from './components/Layout'


export default function App() {
  // 🔐 Preload CSRF cookie on app mount
  useEffect(() => {
    fetchCsrfToken().catch((err) =>
      console.error('CSRF preload failed:', err.message)
    )
  }, [])

  return (
    <>
      <Navbar />
      <Layout>
        <Routes>
          {/* public */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/password-reset" element={<PasswordResetRequest />} />
          <Route path="/password-reset/confirm" element={<PasswordResetConfirm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mfa-setup" element={<MfaSetup />} />
          <Route path="/mfa-login" element={<MfaLogin />} />

          {/* protected */}
          <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/products/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
          <Route path="/shopping-list" element={<ProtectedRoute><ShoppingList /></ProtectedRoute>} />
          <Route path="/protected" element={<ProtectedRoute><ProtectedTest /></ProtectedRoute>} />

          {/* Account */}
          <Route path="/account" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
          <Route path="/account/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/account/change-email" element={<ProtectedRoute><ChangeEmail /></ProtectedRoute>} />
          <Route path="/account/confirm-email-change/:token" element={<ProtectedRoute><ConfirmEmail /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </>
  )
}