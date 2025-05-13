import { db } from './firebase';
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

const USERS_COLLECTION = 'users';

export const findOrCreateMatch = async (uid: string): Promise<string | null> => {
  const userRef = doc(db, USERS_COLLECTION, uid);
  const usersRef = collection(db, USERS_COLLECTION);

  // Make sure the current user's doc exists first
  await setDoc(userRef, {
    status: 'init',
    peerId: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true }); // merge to avoid overwriting existing fields

  // Try to find a waiting user (excluding self)
  const q = query(usersRef, where('status', '==', 'waiting'));
  const snapshot = await getDocs(q);

  const waitingUser = snapshot.docs.find((doc) => doc.id !== uid);

  if (waitingUser) {
    const peerId = waitingUser.id;

    // Pair both users
    await Promise.all([
      updateDoc(userRef, {
        status: 'paired',
        peerId,
        updatedAt: serverTimestamp(),
      }),
      updateDoc(doc(db, USERS_COLLECTION, peerId), {
        status: 'paired',
        peerId: uid,
        updatedAt: serverTimestamp(),
      }),
    ]);

    return peerId;
  }

  // No match found → mark self as waiting
  await updateDoc(userRef, {
    status: 'waiting',
    peerId: null,
    updatedAt: serverTimestamp(),
  });

  return null;
};
