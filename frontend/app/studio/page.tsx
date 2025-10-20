'use client';
import React, { useEffect, useState } from 'react';
import Upload from '../../components/Upload';
import { useGenerate } from '../../hooks/useGenerate';
import axios from 'axios';

export default function StudioPage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Classic');
  const [imageBase64, setImageBase64] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const { generate, loading, abort } = useGenerate();

  useEffect(() => { fetchHistory(); }, []);

  async function fetchHistory() {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/generations?limit=5', { headers: { Authorization: `Bearer ${token}` } });
      setHistory(res.data);
    } catch (err:any) {
      console.error(err);
    }
  }

  async function onGenerate() {
    try {
      const data = await generate({ prompt, style, imageBase64 });
      setCurrentImageUrl(data.imageUrl);
      await fetchHistory();
    } catch (e:any) {
      alert(e.message || 'error');
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>AI Studio</h2>
      <div style={{ marginBottom: 10 }}>
        <Upload onChange={(b64)=> setImageBase64(b64)} />
      </div>
      <div style={{ marginBottom: 10 }}>
        <input value={prompt} onChange={(e)=>setPrompt(e.target.value)} placeholder="Prompt" />
      </div>
      <div style={{ marginBottom: 10 }}>
        <select value={style} onChange={(e)=>setStyle(e.target.value)}>
          <option>Classic</option>
          <option>Avant-garde</option>
          <option>Street</option>
        </select>
      </div>
      <div style={{ marginBottom: 10 }}>
        <button onClick={onGenerate} disabled={loading}>{loading ? 'Generating...' : 'Generate'}</button>
        <button onClick={abort} style={{ marginLeft: 8 }}>Abort</button>
      </div>

      {currentImageUrl && (
        <div>
          <h3>Result</h3>
          <img src={currentImageUrl} alt="result" style={{ maxWidth: 400 }} />
        </div>
      )}

      <h3>History</h3>
      <div>
        {history.map((h) => (
          <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
               onClick={() => { setPrompt(h.prompt); setStyle(h.style); setImageBase64(h.imageUrl.split(',')[1] || ''); setCurrentImageUrl(h.imageUrl); }}>
            <img src={h.imageUrl} style={{ width: 80 }} alt="thumb" />
            <div>
              <div>{h.prompt}</div>
              <div style={{ fontSize: 12 }}>{h.style}</div>
              <div style={{ fontSize: 12 }}>{new Date(h.createdAt).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
