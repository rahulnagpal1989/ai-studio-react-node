'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import AuthGate from '../components/AuthGate';
import Header from '../components/Header';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'}/auth/login`,
        { email, password }
      );
      localStorage.setItem('token', res.data.token);
      router.push('/studio');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.details?.join(', ') ||
        err.response?.data?.message ||
        'Login failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthGate>
      <div className='max-w-7xl mx-auto px-4 py-4 md:py-8'>
        <Header />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='bg-slate-900/60 border border-slate-700 rounded-lg rounded-t-none p-4 md:p-8 shadow-lg'>
            <h2 className='text-white text-xl font-bold tracking-tight'>
              Welcome back
            </h2>
            <p className='text-gray-400'>
              Sign in to continue creating amazing images.
            </p>

            {error && (
              <div className='mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg'>
                <div className='flex items-center gap-2'>
                  <svg
                    className='w-5 h-5 text-red-400 flex-shrink-0'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <p className='text-red-300 text-sm font-medium'>{error}</p>
                </div>
              </div>
            )}

            <form
              onSubmit={submit}
              className='grid gap-3'
              role='form'
              aria-label='Login form'
            >
              <div>
                <label htmlFor='login-email' className='sr-only'>
                  Email address
                </label>
                <input
                  id='login-email'
                  className='w-full rounded-lg border border-slate-700 bg-slate-900/60 text-slate-100 px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition'
                  type='text'
                  name='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder='Email'
                  required
                  aria-describedby='login-email-help'
                />
                <div id='login-email-help' className='sr-only'>
                  Enter your email address
                </div>
              </div>
              <div>
                <label htmlFor='login-password' className='sr-only'>
                  Password
                </label>
                <input
                  id='login-password'
                  className='w-full rounded-lg border border-slate-700 bg-slate-900/60 text-slate-100 px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition'
                  type='password'
                  name='password'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder='Password'
                  required
                  aria-describedby='login-password-help'
                />
                <div id='login-password-help' className='sr-only'>
                  Enter your password
                </div>
              </div>
              <div>
                <button
                  className='btn btn-primary w-full flex items-center justify-center gap-2'
                  type='submit'
                  disabled={loading}
                  aria-describedby='login-submit-help'
                >
                  {loading && (
                    <svg
                      className='animate-spin h-4 w-4 text-white'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                  )}
                  {loading ? 'Signing in...' : 'Login'}
                </button>
                <div id='login-submit-help' className='sr-only'>
                  Sign in to your account
                </div>
              </div>
            </form>
          </div>
          <div className='bg-slate-900/60 border border-slate-700 rounded-lg rounded-t-none p-4 md:p-8 shadow-lg'>
            <h2 className='text-white text-xl font-bold tracking-tight'>
              Why AI Studio?
            </h2>
            <p className='text-gray-400'>
              Turn prompts and references into polished visuals with one click.
            </p>
          </div>
        </div>
      </div>
    </AuthGate>
  );
}
