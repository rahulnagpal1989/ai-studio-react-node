'use client';
import { useState, useRef } from 'react';
import axios from 'axios';

export function useGenerate() {
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  async function generate(payload: { prompt: string; style: string; imageBase64: string }, retries = 3) {
    setLoading(true);
    controllerRef.current = new AbortController();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:4000/generations', payload, {
        signal: controllerRef.current.signal,
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoading(false);
      return res.data;
    } catch (err: any) {
      setLoading(false);
      if (axios.isCancel(err)) {
        throw new Error('aborted');
      }
      if (err.response?.status === 503 && retries > 0) {
        return generate(payload, retries - 1);
      }
      throw err;
    }
  }

  function abort() {
    controllerRef.current?.abort();
    controllerRef.current = null;
  }

  return { generate, loading, abort };
}
