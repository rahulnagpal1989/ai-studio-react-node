'use client';
import React, { useState, useEffect, useRef } from 'react';

export default function Upload({ imageBase64, onChange }: { imageBase64: string, onChange: (base64: string, file: File) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset file input when imageBase64 is cleared
  useEffect(() => {
    if (!imageBase64) {
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [imageBase64]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!['image/png', 'image/jpeg'].includes(f.type)) return alert('only png/jpg');
    if (f.size > 10 * 1024 * 1024) return alert('max 10MB');
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const base64 = result.split(',')[1] || '';
      setPreview(result);
      onChange(base64, f);
    };
    reader.readAsDataURL(f);
  }
  return (
    <div>
      <input 
        ref={fileInputRef}
        name="image" 
        className="w-full rounded-lg border border-slate-700 bg-slate-900/60 text-slate-100 px-4 py-3 outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500 transition" 
        type="file" 
        accept="image/png,image/jpeg" 
        onChange={handleFile} 
      />
      {imageBase64 && preview && <img className="!max-w-60" src={preview} alt="preview" />}
    </div>
  );
}
