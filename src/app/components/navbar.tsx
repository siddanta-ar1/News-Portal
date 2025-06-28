'use client';

import Link from 'next/link';
import { useState } from 'react';
import AuthButtons from './AuthButtons';
import { Menu, X } from 'lucide-react'; // Icons from Lucide, install via `npm i lucide-react`

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/', label: '🏠 Home' },
    { href: '/submit-news', label: '📝 Submit News' },
    { href: '/country-guide', label: '🌍 Country Guide' },
    { href: '/favorites', label: '⭐ My Favorites' },
    { href: '/my-invites', label: '👥 My Invites' },
    { href: '/invite-user', label: '📩 Invite User' },
    { href: '/check-author', label: '📬 Confirm Author' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-blue-700 dark:text-white">
          📰 News Portal
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-3 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-blue-600 dark:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-2 rounded-md transition"
            >
              {link.label}
            </Link>
          ))}
          <AuthButtons />
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-blue-600 dark:text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 px-4 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-blue-600 dark:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-2 rounded-md transition"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <AuthButtons />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
