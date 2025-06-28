// app/confirm-author/ConfirmAuthorClient.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

export default function ConfirmAuthorClient() {
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
    <div className="max-w-xl mx-auto py-10 px-4 text-center">
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
}
