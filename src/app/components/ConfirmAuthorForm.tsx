'use client';

import { useState } from 'react';
import { supabase } from '@/app/lib/supabase';

export default function ConfirmAuthorForm() {
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const sendConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: session } = await supabase.auth.getUser();
    const user = session.user;
    if (!user) {
      setMessage('🔒 Please log in first.');
      return;
    }

    if (email === user.email) {
      setMessage('❌ You cannot send to your own email.');
      return;
    }

    const { data, error } = await supabase
      .from('news_author_confirmations')
      .insert({
        requester_id: user.id,
        potential_author_email: email,
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Supabase Insert Error:", error);
      setMessage('❌ Error saving confirmation.');
      return;
    }

    await fetch('/api/send-confirmation-email', {
      method: 'POST',
      body: JSON.stringify({
        email,
        newsTitle: title,
        confirmationId: data.id,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    setMessage(`✅ Email sent to ${email}`);
    setEmail('');
    setTitle('');
  };

  return (
    <form onSubmit={sendConfirmation} className="space-y-4">
      {/* News Title Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          News Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="Enter news title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Author Email Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Author Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          required
          placeholder="Author's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition"
      >
        ✉️ Send Confirmation Email
      </button>

      {/* Message */}
      {message && <p className="text-sm text-center text-gray-700 dark:text-gray-300">{message}</p>}
    </form>
  );
}
