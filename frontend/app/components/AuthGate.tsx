'use client';
import { useRouter } from 'next/navigation';
import React, { useLayoutEffect, useState } from 'react';

type ChildrenRenderer = (ready: boolean) => React.ReactNode;
type AuthGateProps = {
  redirectIfAuthedTo?: string;
  children: React.ReactNode | ChildrenRenderer;
  showSpinner?: boolean;
};

export default function AuthGate({
  redirectIfAuthedTo = '/studio',
  children,
  showSpinner = true,
}: AuthGateProps) {
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useLayoutEffect(() => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      router.replace(redirectIfAuthedTo);
    } else {
      setReady(true);
    }
  }, [router, redirectIfAuthedTo]);

  if (!ready) {
    if (!showSpinner) return null;
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='bg-slate-900/60 border border-slate-700 rounded-lg p-8 shadow-lg text-center'>
          <div className='spinner' />
          <div className='text-gray-400'>Checking session…</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
