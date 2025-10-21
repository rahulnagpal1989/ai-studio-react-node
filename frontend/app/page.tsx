'use client';
import Header from './components/Header';

export default function Home() {
  return (
    <main style={{ padding: 20 }}>
      <Header />
      <div className='bg-slate-900/60 border border-slate-700 rounded-lg rounded-t-none p-8 shadow-lg'>
        <h1 className='text-white text-xl font-bold tracking-tight'>
          Modelia Mini AI Studio
        </h1>
        <p className='text-gray-400'>
          Turn prompts and references into polished visuals with one click.
        </p>
      </div>
    </main>
  );
}
