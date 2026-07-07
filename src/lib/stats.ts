import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export interface PickRecord {
  typeId: string;
  typeName: string;
  categoryId: string;
  categoryName: string;
  menu: string;
}

function slugify(value: string): string {
  return value.trim().replace(/\s+/g, '-');
}

export async function recordPick(pick: PickRecord): Promise<void> {
  const statId = `${pick.typeId}__${pick.categoryId}__${slugify(pick.menu)}`;
  try {
    await Promise.all([
      setDoc(
        doc(db, 'pickStats', statId),
        { ...pick, count: increment(1), lastPickedAt: serverTimestamp() },
        { merge: true },
      ),
      addDoc(collection(db, 'pickHistory'), { ...pick, createdAt: serverTimestamp() }),
    ]);
  } catch (err) {
    console.warn('[firestore] recordPick failed', err);
  }
}

export async function fetchRecentPicks(count = 8): Promise<PickRecord[]> {
  try {
    const q = query(collection(db, 'pickHistory'), orderBy('createdAt', 'desc'), limit(count));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as PickRecord);
  } catch (err) {
    console.warn('[firestore] fetchRecentPicks failed', err);
    return [];
  }
}
