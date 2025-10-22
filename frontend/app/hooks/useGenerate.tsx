'use client';
import axios from 'axios';
import { useState, useRef } from 'react';

import { useRetry } from './useRetry';

export function useGenerate() {
  const [loading, setLoading] = useState(false);
  const [retryMessage, setRetryMessage] = useState('');
  const controllerRef = useRef<AbortController | null>(null);
  const maxRetry = 3;
  const initialDelay = 500;

  // Use the retry hook at the top level
  const { retry } = useRetry();

  async function generate(payload: {
    prompt: string;
    style: string;
    image: string;
  }) {
    const token = localStorage.getItem('token');
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    async function callApi() {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'}/generations`,
        payload,
        {
          signal,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    }

    setLoading(true);
    setRetryMessage('');
    try {
      const data = await retry(
        callApi,
        maxRetry,
        initialDelay,
        (attempt, maxRetries) => {
          if (signal.aborted) setRetryMessage(`Aborting...`);
          else
            setRetryMessage(
              `Generation failed. Retrying... (Attempt ${attempt}/${maxRetries})`
            );
        }
      );
      setRetryMessage('');
      return data;
    } catch (error: any) {
      setRetryMessage('');

      // Handle abort signal
      if (axios.isCancel(error)) {
        setLoading(false);
        setRetryMessage('');
        throw new Error('aborted');
      }

      throw error;
    } finally {
      setLoading(false);
    }
  }

  function abort() {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setRetryMessage('');
  }

  return { generate, loading, abort, retryMessage };
}
