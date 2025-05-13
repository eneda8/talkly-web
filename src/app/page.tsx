'use client';
import { useEffect, useState } from 'react';
import { initAnonymousAuth } from '@/lib/auth';
import { findOrCreateMatch } from '@/lib/matchmaking';

export default function HomePage() {
  const [uid, setUid] = useState<string | null>(null);
  const [peerId, setPeerId] = useState<string | null>(null);

  useEffect(() => {
    initAnonymousAuth()
      .then(async (userId) => {
        setUid(userId);
        const peer = await findOrCreateMatch(userId);
        setPeerId(peer);
      })
      .catch(console.error);
  }, []);

  return (
    <main>
      <h1>Talkly Web</h1>
      {uid ? (
        <>
          <p>Signed in as {uid}</p>
          {peerId ? <p>Matched with {peerId}</p> : <p>Waiting for match...</p>}
        </>
      ) : (
        <p>Signing in...</p>
      )}
    </main>
  );
}
