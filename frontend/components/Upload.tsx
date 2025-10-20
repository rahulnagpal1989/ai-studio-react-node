'use client';
import React, { useState } from 'react';

export default function Upload({ onChange }: { onChange: (base64: string, file: File) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
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
      <input type="file" accept="image/png,image/jpeg" onChange={handleFile} />
      {preview && <img src={preview} alt="preview" style={{ maxWidth: 300 }} />}
    </div>
  );
}
