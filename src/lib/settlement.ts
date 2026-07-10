export interface Participant {
  id: string;
  name: string;
  drinker: boolean;
}

export interface Round {
  id: string;
  label: string;
  amount: number;
  participantIds: string[];
}

export interface PersonTotal {
  participant: Participant;
  total: number;
  breakdown: { roundId: string; roundLabel: string; amount: number }[];
}

let idCounter = 0;

export function makeId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}-${Math.random().toString(36).slice(2, 8)}`;
}

export function makeParticipant(name: string): Participant {
  return { id: makeId('m'), name, drinker: true };
}

export function makeRound(label: string, participantIds: string[]): Round {
  return { id: makeId('r'), label, amount: 0, participantIds };
}

export function formatWon(amount: number): string {
  return `${Math.round(amount).toLocaleString('ko-KR')}원`;
}

/** 금액을 10원 단위로 최대한 균등하게 나누되, 합이 정확히 amount가 되도록 나머지를 앞사람부터 배분합니다. */
export function splitEvenly(amount: number, count: number): number[] {
  if (count <= 0 || amount <= 0) return [];
  const unit = 10;
  const base = Math.floor(amount / count / unit) * unit;
  const shares = Array<number>(count).fill(base);
  let remainder = amount - base * count;
  let i = 0;
  while (remainder >= unit) {
    shares[i % count] += unit;
    remainder -= unit;
    i += 1;
  }
  if (remainder > 0) {
    shares[0] += remainder;
  }
  return shares;
}

export function computeTotals(participants: Participant[], rounds: Round[]): PersonTotal[] {
  const totals = new Map<string, PersonTotal>();
  participants.forEach((p) => totals.set(p.id, { participant: p, total: 0, breakdown: [] }));

  rounds.forEach((round) => {
    const included = round.participantIds.filter((id) => totals.has(id));
    if (included.length === 0 || round.amount <= 0) return;
    const shares = splitEvenly(round.amount, included.length);
    included.forEach((id, i) => {
      const entry = totals.get(id);
      if (!entry) return;
      entry.total += shares[i];
      entry.breakdown.push({ roundId: round.id, roundLabel: round.label, amount: shares[i] });
    });
  });

  return participants.map((p) => totals.get(p.id)).filter((t): t is PersonTotal => !!t);
}

export function totalAmount(rounds: Round[]): number {
  return rounds.reduce((sum, r) => sum + r.amount, 0);
}
