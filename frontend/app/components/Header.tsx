'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useLayoutEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<undefined | boolean>();
  useLayoutEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [router]);

  return (
    <nav
      className='bg-gray-900/60 backdrop-blur-sm rounded-lg rounded-b-none sticky top-0 z-20'
      role='navigation'
      aria-label='Main navigation'
    >
      <div className='flex justify-between items-center gap-4 px-4 py-6'>
        <Link
          href='/'
          className='text-white text-2xl font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded'
        >
          AI Studio
        </Link>
        <div className='flex items-center gap-4' role='menubar'>
          <Link
            className='text-slate-300 hover:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1'
            href='/'
            role='menuitem'
          >
            Home
          </Link>
          {isLoggedIn ? (
            <Link
              className='text-slate-300 hover:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1'
              href='/studio'
              role='menuitem'
            >
              Studio
            </Link>
          ) : (
            <Link
              className='text-slate-300 hover:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1'
              href='/signup'
              role='menuitem'
            >
              Signup
            </Link>
          )}
          {isLoggedIn ? (
            <Link
              className='text-slate-300 hover:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1'
              href='/logout'
              role='menuitem'
            >
              Logout
            </Link>
          ) : (
            <Link
              className='text-slate-300 hover:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1'
              href='/login'
              role='menuitem'
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
