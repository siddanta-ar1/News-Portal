// src/app/my-confirmations/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';

interface Confirmation {
  id: string;
  potential_author_email: string;
  status: string;
  created_at: string;
}

export default function MyConfirmationsPage() {
  const [confirmations, setConfirmations] = useState<Confirmation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfirmations = async () => {
      const { data: session } = await supabase.auth.getUser();
      const user = session.user;
      if (!user) return;

      const { data, error } = await supabase
        .from('news_author_confirmations')
        .select('*')
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setConfirmations(data);
      }

      setLoading(false);
    };

    fetchConfirmations();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">📬 Your Author Confirmation Requests</h1>
      {confirmations.length === 0 ? (
        <p>No confirmation requests yet.</p>
      ) : (
        <ul className="space-y-4">
          {confirmations.map((item) => (
            <li
              key={item.id}
              className="border rounded-md p-4 bg-white text-white dark:bg-gray-800 shadow"
            >
              <p><strong>Author Email:</strong> {item.potential_author_email}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span
                  className={`font-semibold ${
                    item.status === 'confirmed'
                      ? 'text-green-600'
                      : item.status === 'denied'
                      ? 'text-red-500'
                      : 'text-yellow-600'
                  }`}
                >
                  {item.status}
                </span>
              </p>
              <p className="text-sm text-gray-500">Sent: {new Date(item.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
