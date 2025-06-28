// app/confirm-author/page.tsx
import { Suspense } from 'react';
import ConfirmAuthorClient from './ConfirmAuthorClient';

export default function ConfirmAuthorPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">⏳ Loading...</div>}>
      <ConfirmAuthorClient />
    </Suspense>
  );
}
