'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import Header from '../components/Header';
import RequireAuth from '../components/RequireAuth';
import Upload from '../components/Upload';
import { useGenerate } from '../hooks/useGenerate';

export default function StudioPage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Classic');
  const [imageBase64, setImageBase64] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const { generate, loading, abort, retryMessage } = useGenerate();

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/generations?limit=5`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistory(res.data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.details?.join(', ') ||
        'Failed to load history';
      setError(errorMessage);
    }
  }

  async function onGenerate() {
    setError(''); // Clear previous errors
    try {
      const data = await generate({ prompt, style, image: imageBase64 });
      setCurrentImageUrl(data.imageUrl);
      await fetchHistory();

      setPrompt('');
      setStyle('Classic');
      setImageBase64('');
    } catch (e: any) {
      const errorMessage =
        e.response?.data?.details?.join(', ') ||
        e.response?.data?.message ||
        e.message ||
        'Generation failed';
      setError(errorMessage);
    }
  }

  return (
    <RequireAuth>
      <div className='max-w-7xl mx-auto px-4 py-4 md:py-8'>
        <Header />
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          <div className='bg-slate-900/60 border border-slate-700 rounded-lg rounded-t-none p-4 md:p-8 shadow-lg'>
            <h2 className='text-white text-xl font-bold tracking-tight'>
              AI Studio
            </h2>

            <div
              className='grid gap-3'
              role='form'
              aria-label='AI generation form'
            >
              <Upload
                imageBase64={imageBase64}
                onChange={b64 => setImageBase64(b64)}
              />
              <div>
                <label htmlFor='prompt-input' className='sr-only'>
                  Image prompt
                </label>
                <input
                  id='prompt-input'
                  name='prompt'
                  className='w-full rounded-lg border border-slate-700 bg-slate-900/60 text-slate-100 px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition'
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder='Enter Prompt'
                  required
                  aria-describedby='prompt-help'
                />
                <div id='prompt-help' className='sr-only'>
                  Describe the image you want to generate
                </div>
              </div>
              <div>
                <label htmlFor='style-select' className='sr-only'>
                  Art style
                </label>
                <select
                  id='style-select'
                  name='style'
                  className='w-full rounded-lg border border-slate-700 bg-slate-900/60 text-slate-100 px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition'
                  value={style}
                  onChange={e => setStyle(e.target.value)}
                  aria-describedby='style-help'
                >
                  <option value='Classic'>Classic</option>
                  <option value='Avant-garde'>Avant-garde</option>
                  <option value='Street'>Street</option>
                </select>
                <div id='style-help' className='sr-only'>
                  Choose the artistic style for your image
                </div>
              </div>
              <div className='flex flex-col sm:flex-row gap-2'>
                <button
                  className='btn btn-primary w-full flex items-center justify-center gap-2'
                  onClick={onGenerate}
                  disabled={loading}
                  aria-describedby='generate-help'
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
                  {loading ? 'Generating...' : 'Generate'}
                </button>
                <button
                  className='btn btn-secondary flex-1 sm:flex-none'
                  onClick={abort}
                  aria-describedby='abort-help'
                >
                  Abort
                </button>
              </div>
              <div id='generate-help' className='sr-only'>
                Generate an image based on your prompt and style
              </div>
              <div id='abort-help' className='sr-only'>
                Cancel the current generation process
              </div>
            </div>

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

            {retryMessage && (
              <div className='mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg'>
                <div className='flex items-center gap-2'>
                  <svg
                    className='w-5 h-5 text-yellow-400 flex-shrink-0 animate-spin'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <p className='text-yellow-300 text-sm font-medium'>
                    {retryMessage}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className='bg-slate-900/60 border border-slate-700 rounded-lg rounded-t-none p-4 md:p-8 shadow-lg'>
            {currentImageUrl ? (
              <div>
                <h2 className='text-white text-xl font-bold tracking-tight'>
                  Result
                </h2>
                <img
                  src={currentImageUrl}
                  alt='result'
                  className='w-full max-w-md mx-auto'
                />
              </div>
            ) : (
              <div className='text-gray-400'>Your result will appear here.</div>
            )}
            <h3
              className='text-white text-xl font-bold tracking-tight'
              style={{ marginTop: 16 }}
            >
              History
            </h3>
            <div
              className='grid gap-3'
              role='region'
              aria-label='Generation history'
            >
              {!history.length && (
                <div className='text-gray-400'>No history found.</div>
              )}
              {history.map(h => (
                <div
                  key={h.id}
                  className='flex items-center gap-3 cursor-pointer hover:bg-slate-800/50 p-2 rounded-lg transition focus:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                  onClick={() => {
                    setPrompt(h.prompt);
                    setStyle(h.style);
                    setImageBase64(h.imageUrl.split(',')[1] || '');
                    setCurrentImageUrl(h.imageUrl);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setPrompt(h.prompt);
                      setStyle(h.style);
                      setImageBase64(h.imageUrl.split(',')[1] || '');
                      setCurrentImageUrl(h.imageUrl);
                    }
                  }}
                  tabIndex={0}
                  role='button'
                  aria-label={`Load prompt: ${h.prompt} with style: ${h.style}`}
                >
                  <img
                    src={h.imageUrl}
                    className='w-16 h-16 rounded-lg object-cover flex-shrink-0'
                    alt={`Generated image: ${h.prompt}`}
                  />
                  <div className='min-w-0 flex-1'>
                    <div className='text-white text-sm font-medium truncate'>
                      {h.prompt}
                    </div>
                    <div className='text-gray-400 text-xs'>{h.style}</div>
                    <div className='text-gray-400 text-xs'>
                      {new Date(h.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
