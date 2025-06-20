// app/layout.tsx

import './globals.css';
import React from 'react';
import Navbar from './components/navbar';

export const metadata = {
  title: 'News Portal',
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
      <Navbar/>
</header>


    <main className="p-6 max-w-4xl mx-auto">
      {children}
    </main>
  </body>
</html>


  );
}
