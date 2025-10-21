'use client';
import React, { useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type RequireAuthProps = {
  children: React.ReactNode;
  showSpinner?: boolean;
  redirectTo?: string;
};

export default function RequireAuth({ children, showSpinner = true, redirectTo = '/login' }: RequireAuthProps) {
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useLayoutEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace(redirectTo);
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    if (!showSpinner) return null;
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-8 shadow-lg text-center">
          <div className="spinner" />
          <div className="text-gray-400">Verifying access…</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}


