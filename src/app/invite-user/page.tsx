'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { User } from '@supabase/supabase-js';

export default function InvitePage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch the current user once on mount
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        setMessage('❌ Error fetching user.');
      } else {
        setCurrentUser(data.user);
      }
    };

    fetchUser();
  }, []);

  const isSelfInvite =
    email.trim().toLowerCase() === currentUser?.email?.toLowerCase();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      setMessage('Please log in first.');
      return;
    }

    if (isSelfInvite) {
      setMessage("🚫 You can't invite yourself.");
      return;
    }

    // Save invite to database
    const { error: insertError } = await supabase.from('invites').insert({
      inviter_id: currentUser.id,
      invitee_email: email,
    });

    if (insertError) {
      console.error(insertError);
      setMessage('❌ Error recording invite.');
      return;
    }

    // Send email invite via magic link
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error(error);
      setMessage('❌ Failed to send invite.');
    } else {
      setMessage(`✅ Invitation sent to ${email}`);
      setEmail('');
    }
  };

  return (
    <main className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded shadow space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">📩 Invite Someone</h1>

      <form onSubmit={handleInvite} className="space-y-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email to invite"
          className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
        />

        <button
          type="submit"
          disabled={!email || isSelfInvite}
          className={`w-full py-2 rounded text-white font-medium ${
            isSelfInvite
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSelfInvite ? "🚫 Can't Invite Yourself" : 'Send Invite'}
        </button>
      </form>

      {message && (
        <p className="text-sm font-medium text-green-600 dark:text-green-400">
          {message}
        </p>
      )}
    </main>
  );
}
