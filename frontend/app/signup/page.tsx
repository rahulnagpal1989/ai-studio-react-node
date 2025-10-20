'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/auth/signup', { email, password });
      localStorage.setItem('token', res.data.token);
      router.push('/studio');
    } catch (err:any) {
      alert(err.response?.data?.message || 'error');
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Signup</h2>
      <form onSubmit={submit}>
        <input type="text" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
