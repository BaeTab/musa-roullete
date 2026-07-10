import { addDoc, collection, doc, getDoc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { RouletteType } from '../data/menuData';

export interface PartyCandidate {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryEmoji: string;
  menu: string;
}

export interface PartySession {
  typeId: string;
  typeName: string;
  typeEmoji: string;
  typeAccent: string;
  typeSoft: string;
  candidates: PartyCandidate[];
  votes: Record<string, string>;
  status: 'voting' | 'done';
  winnerCandidateId: string | null;
  hostParticipantId: string;
}

const PARTICIPANT_KEY = 'roulette:participantId';
const CANDIDATE_COUNT = 4;

export function getParticipantId(): string {
  let id = localStorage.getItem(PARTICIPANT_KEY);
  if (!id) {
    id = `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem(PARTICIPANT_KEY, id);
  }
  return id;
}

function pickCandidates(type: RouletteType): PartyCandidate[] {
  const pool = type.categories.flatMap((c) =>
    c.items.map((menu) => ({ categoryId: c.id, categoryName: c.name, categoryEmoji: c.emoji, menu })),
  );
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const seenMenu = new Set<string>();
  const picked: PartyCandidate[] = [];
  for (const item of shuffled) {
    if (seenMenu.has(item.menu)) continue;
    seenMenu.add(item.menu);
    picked.push({ ...item, id: `${picked.length}` });
    if (picked.length >= CANDIDATE_COUNT) break;
  }
  return picked;
}

export async function createPartySession(type: RouletteType): Promise<string> {
  const candidates = pickCandidates(type);
  const ref = await addDoc(collection(db, 'partySessions'), {
    typeId: type.id,
    typeName: type.name,
    typeEmoji: type.emoji,
    typeAccent: type.accent,
    typeSoft: type.soft,
    candidates,
    votes: {},
    status: 'voting',
    winnerCandidateId: null,
    hostParticipantId: getParticipantId(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function fetchPartySession(sessionId: string): Promise<PartySession | null> {
  const snap = await getDoc(doc(db, 'partySessions', sessionId));
  return snap.exists() ? (snap.data() as PartySession) : null;
}

export function subscribeToParty(sessionId: string, cb: (session: PartySession | null) => void): () => void {
  return onSnapshot(
    doc(db, 'partySessions', sessionId),
    (snap) => cb(snap.exists() ? (snap.data() as PartySession) : null),
    () => cb(null),
  );
}

export async function castVote(sessionId: string, candidateId: string): Promise<void> {
  const participantId = getParticipantId();
  await updateDoc(doc(db, 'partySessions', sessionId), {
    [`votes.${participantId}`]: candidateId,
    updatedAt: serverTimestamp(),
  });
}

export function tallyVotes(session: PartySession): Record<string, number> {
  const tally: Record<string, number> = {};
  session.candidates.forEach((c) => {
    tally[c.id] = 0;
  });
  Object.values(session.votes).forEach((candidateId) => {
    if (tally[candidateId] !== undefined) tally[candidateId] += 1;
  });
  return tally;
}

export async function closeVoting(sessionId: string, session: PartySession): Promise<void> {
  const tally = tallyVotes(session);
  const maxVotes = Math.max(...Object.values(tally), 0);
  const topCandidates = session.candidates.filter((c) => tally[c.id] === maxVotes);
  const winner = topCandidates[Math.floor(Math.random() * topCandidates.length)] ?? session.candidates[0];
  await updateDoc(doc(db, 'partySessions', sessionId), {
    status: 'done',
    winnerCandidateId: winner.id,
    updatedAt: serverTimestamp(),
  });
}

export function buildPartyShareUrl(sessionId: string): string {
  const url = new URL(window.location.origin);
  url.searchParams.set('party', sessionId);
  return url.toString();
}
