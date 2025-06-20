'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';

interface Invite {
  id: string;
  invitee_email: string;
  status: string;
  created_at: string;
}

interface LeaderboardRow {
  inviter_id: string;
  count: number;
}

export default function MyInvitesPage() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData?.user?.id ?? null;
      setUserId(uid);

      if (uid) {
        // Fetch user-specific invites
        const { data: myInvites, error: invitesError } = await supabase
          .from('invites')
          .select('*')
          .eq('inviter_id', uid)
          .order('created_at', { ascending: false });

        if (!invitesError) setInvites(myInvites || []);

        // Fetch leaderboard via RPC
        const { data: board, error: leaderboardError } = await supabase.rpc('get_invite_leaderboard');
        if (!leaderboardError) setLeaderboard(board || []);
        else console.error('Leaderboard error:', leaderboardError);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  const myScore = leaderboard.find((l) => l.inviter_id === userId)?.count || 0;
  const maxScore = Math.max(...leaderboard.map((l) => l.count), 0);

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 Your Invitation Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <section className="bg-white dark:bg-gray-900 rounded shadow p-4 space-y-2">
            <h2 className="text-xl font-semibold text-white">🎯 You invited {invites.length} users</h2>
            <ul className="space-y-2 text-white">
              {invites.map((inv) => (
                <li
                  key={inv.id}
                  className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <span>{inv.invitee_email}</span>
                  <span
                    className={`${
                      inv.status === 'completed' ? 'text-green-600' : 'text-yellow-500'
                    }`}
                  >
                    {inv.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white dark:bg-gray-900 rounded shadow p-4">
            <h2 className="text-xl font-semibold mb-2 text-white">🏆 Leaderboard</h2>
            <p className="mb-3 text-sm text-white">
              You invited <strong>{myScore}</strong> users.
              {myScore === maxScore && myScore > 0
                ? ' 🎉 You are leading!'
                : ` 🥇 Top score: ${maxScore}`}
            </p>
            <ol className="list-decimal text-white ml-5 space-y-1 text-sm">
              {leaderboard
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)
                .map((user, i) => (
                  <li key={i}>
                    <code>{user.inviter_id.slice(0, 6)}…</code>: {user.count} invites
                  </li>
                ))}
            </ol>
          </section>
        </>
      )}
    </main>
  );
}
