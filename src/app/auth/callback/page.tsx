'use client';

import { useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Try to match email in invites table and update the invitee_id
        const { error: updateError } = await supabase
          .from('invites')
          .update({ invitee_id: user.id, status: 'completed' })
          .eq('invitee_email', user.email)
          .is('invitee_id', null); // only update if not already linked

        if (updateError) console.error(updateError);
      }

      router.push('/');
    };

    handleAuth();
  }, [router]);

  return (
    <main className="p-6 text-center">
      <p className="text-lg">🔄 Finishing login, please wait...</p>
    </main>
  );
}
