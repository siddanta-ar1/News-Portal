// app/layout.tsx
import Link from 'next/link';
import AuthButtons from './components/AuthButtons';

import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Simple News Portal',
  description: 'News portal with Next.js 15, News API & Supabase',
  icons: {
    icon: '/favicon-1.png',
    apple: '/favicon-1.png',
    shortcut: '/favicon-1.png',
    
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
  <body className="bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen">
    <header className="bg-blue-600 dark:bg-gray-800 shadow-md text-white px-4 sm:px-6 py-4">
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

      {/* Favorites Button */}
      <a
        href="/favorites"
        className="bg-white text-blue-600 dark:bg-gray-700 dark:text-white px-4 py-2 rounded-md shadow hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base"
      >
        ⭐ My Favorites
      </a>

      {/* Auth Buttons */}
      <AuthButtons />
    </div>
  </div>
</header>


    <main className="p-6 max-w-4xl mx-auto">
      {children}
    </main>
  </body>
</html>


  );
}
