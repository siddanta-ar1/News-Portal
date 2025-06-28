// src/app/check-author/page.tsx
'use client';

import ConfirmAuthorForm from '../components/ConfirmAuthorForm';

export default function CheckAuthorPage() {
  return (
    <main className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-lg shadow space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
        📬 Request Author Confirmation
      </h1>
      <ConfirmAuthorForm />
    </main>
  );
}
