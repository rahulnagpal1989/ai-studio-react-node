'use client';
import { useRouter } from 'next/navigation';
import { useLayoutEffect } from 'react';

export default function Logout() {
    const router = useRouter();

    useLayoutEffect(()=>{
        localStorage.removeItem('token');
        router.push('/');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-8 shadow-lg text-center">
            <div className="spinner" />
            <div className="text-gray-400">Logging out...</div>
            </div>
        </div>
    )
}