// src/components/Sidebar.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import {
  FaHome,
  FaUserPlus,
  FaUserCog,
  FaEnvelope,
} from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'

interface SidebarProps {
  onHowToClick: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ onHowToClick }) => {
  const { user } = useAuth()

  return (
    <aside className="w-64 h-screen bg-white border-r p-6">
      <nav className="flex flex-col">
        <Link
          to="/"
          className="flex items-center text-2xl font-medium py-3 hover:text-blue-600"
        >
          <FaHome className="mr-3 w-7 h-7" />
          Home
        </Link>

        {/* Only show this when NOT logged in */}
        {!user && (
          <button
            onClick={onHowToClick}
            className="flex items-center text-2xl font-medium py-3 hover:text-blue-600 text-left focus:outline-none"
          >
            <FaUserPlus className="mr-3 w-7 h-7" />
            How to Create Your Account
          </button>
        )}

        {/* Only show settings when logged in */}
        {user && (
          <Link
            to="/account"
            className="flex items-center text-2xl font-medium py-3 hover:text-blue-600"
          >
            <FaUserCog className="mr-3 w-7 h-7" />
            Your Account Settings
          </Link>
        )}

        <Link
          to="/contact"
          className="flex items-center text-2xl font-medium py-3 hover:text-blue-600"
        >
          <FaEnvelope className="mr-3 w-7 h-7" />
          Contact Us
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar
