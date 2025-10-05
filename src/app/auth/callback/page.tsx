'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function AuthCallbackPage() {
  const { handleOAuthCallback } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Ref pro sledování, zda byl callback již spuštěn
  const callbackCalled = useRef(false);

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        console.error('OAuth Error:', error);
        router.push('/login?error=' + encodeURIComponent(error));
        return;
      }

      if (code && state) {
        try {
          await handleOAuthCallback(code, state);
          // Po úspěšném přihlášení přesměrujeme na dashboard
          router.push('/dashboard');
        } catch (err) {
          console.error('OAuth callback error:', err);
          router.push('/login?error=callback_failed');
        }
      }
    };

    // Spustíme logiku pouze jednou
    if (!callbackCalled.current) {
      callbackCalled.current = true;
      processCallback();
    }
  }, [searchParams, handleOAuthCallback, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner className="h-12 w-12" />
        <p className="text-muted-foreground">Dokončuji přihlášení...</p>
      </div>
    </div>
  );
}