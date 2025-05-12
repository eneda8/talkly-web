'use client';
import { useEffect, useState } from 'react';
import { initAnonymousAuth } from '@/lib/auth';

export default function HomePage() {
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    initAnonymousAuth().then(setUid).catch(console.error);
  }, []);

  return (
    <main>
      <h1>Talkly Web</h1>
      {uid ? <p>Signed in as {uid}</p> : <p>Signing in...</p>}
    </main>
  );
}
