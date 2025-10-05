import { Suspense } from 'react';
import CallbackClient from './callback-client.tsx'; 
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <CallbackClient />
    </Suspense>
  );
}

// Jednoduchá načítací komponenta, která se zobrazí, než se načte hlavní logika
function LoadingComponent() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner className="h-12 w-12" />
    </div>
  )
}