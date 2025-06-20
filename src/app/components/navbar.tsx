import Link from 'next/link'
import React from 'react'
import AuthButtons from './AuthButtons'

const Navbar = () => {
  return (
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
    {/* Site Title */}
    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">📰 News Portal</h1>

    {/* Button Group */}
    <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
      {/* Home Button */}
      <Link
        href="/"
        className="bg-white text-blue-600 dark:bg-gray-700 dark:text-white px-4 py-2 rounded-md shadow hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
      >
        🏠 Home
      </Link>

      {/* Submit News Button */}
      <Link
        href="/submit-news"
        className="bg-white text-blue-600 dark:bg-gray-700 dark:text-white px-4 py-2 rounded-md shadow hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
      >
        📝 Submit News
      </Link>

      {/* Country Guide Button */}
      <Link
        href="/country-guide"
        className="bg-white text-blue-600 dark:bg-gray-700 dark:text-white px-4 py-2 rounded-md shadow hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
      >
        🌍 Country Guide
      </Link>
      {/* Favorites Button */}
      <Link
        href="/favorites"
        className="bg-white text-blue-600 dark:bg-gray-700 dark:text-white px-4 py-2 rounded-md shadow hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
      >
        ⭐ My Favorites
      </Link>
        {/* My Invites Button */}
        <Link
        href="/my-invites"
       className="bg-white text-blue-600 dark:bg-gray-700 dark:text-white px-4 py-2 rounded-md shadow hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
      >
        👥 My Invites
      </Link>
      
        {/* Invite new user Button */}
        <Link
        href="/invite-user"
        className="bg-white text-blue-600 dark:bg-gray-700 dark:text-white px
        4 py-2 rounded-md shadow hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base">
        📩 Invite User
        </Link>


      {/* Auth Buttons */}
      <AuthButtons />
    </div>
  </div>
  )
}

export default Navbar