import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Modelia Mini AI Studio</h1>
      <p><Link href="/signup">Signup</Link> • <Link href="/login">Login</Link> • <Link href="/studio">Studio</Link></p>
    </main>
  );
}
