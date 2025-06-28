// app/confirm-author/page.js
 'use client'; // Keep this line as the component uses client-side hooks

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

// Add this export to disable static rendering (prerendering) for this page
export const dynamic = 'force-dynamic';

export default function ConfirmAuthorPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const isDeny = searchParams.get('deny') === 'true';
  const [message, setMessage] = useState('⏳ Verifying...');

  useEffect(() => {
    const processConfirmation = async () => {
      if (!id) {
        setMessage('❌ Invalid or missing confirmation link.');
        return;
      }

      const { data, error } = await supabase
        .from('news_author_confirmations')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        setMessage('❌ Invalid or expired confirmation.');
        return;
      }

      if (data.status !== 'pending') {
        setMessage(`⚠️ This confirmation has already been ${data.status}.`);
        return;
      }

      const { error: updateError } = await supabase
        .from('news_author_confirmations')
        .update({
          status: isDeny ? 'denied' : 'confirmed',
          responded_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) {
        setMessage('❌ Failed to update confirmation.');
        return;
      }

      setMessage(isDeny ? '❌ You denied authorship.' : '✅ You confirmed authorship. Thank you!');
    };

    processConfirmation();
  }, [id, isDeny]);

  return (
    <div className="max-w-xl mx-auto py-16 px-6 flex flex-col items-center bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        {message.startsWith('✅') && (
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
        )}
        {message.startsWith('❌') && (
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        )}
        {message.startsWith('⏳') && (
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100">
            <svg className="w-10 h-10 text-yellow-500 animate-spin" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          </span>
        )}
        {message.startsWith('⚠️') && (
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100">
            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
            </svg>
          </span>
        )}
      </div>
      <p className="text-xl font-semibold">{message.replace(/^[^ ]+ /, '')}</p>
    </div>
  );
}