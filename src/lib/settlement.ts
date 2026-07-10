export interface Participant {
  id: string;
  name: string;
  drinker: boolean;
}

export interface Round {
  id: string;
  label: string;
  /** 식사·안주 등 참여자 전원이 나누는 금액 */
  sharedAmount: number;
  /** 술값 등 음주자만 나누는 금액 */
  drinkAmount: number;
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
  return { id: makeId('r'), label, sharedAmount: 0, drinkAmount: 0, participantIds };
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
    if (included.length === 0) return;

    if (round.sharedAmount > 0) {
      const shares = splitEvenly(round.sharedAmount, included.length);
      included.forEach((id, i) => {
        const entry = totals.get(id);
        if (!entry) return;
        entry.total += shares[i];
        entry.breakdown.push({ roundId: round.id, roundLabel: `${round.label} · 공통`, amount: shares[i] });
      });
    }

    if (round.drinkAmount > 0) {
      // 이 차수의 참여자 중 음주자만 나누되, 음주자로 표시된 사람이 없으면 참여자 전원이 나눕니다.
      const drinkers = included.filter((id) => totals.get(id)?.participant.drinker);
      const drinkPool = drinkers.length > 0 ? drinkers : included;
      const shares = splitEvenly(round.drinkAmount, drinkPool.length);
      drinkPool.forEach((id, i) => {
        const entry = totals.get(id);
        if (!entry) return;
        entry.total += shares[i];
        entry.breakdown.push({ roundId: round.id, roundLabel: `${round.label} · 주류`, amount: shares[i] });
      });
    }
  });

  return participants.map((p) => totals.get(p.id)).filter((t): t is PersonTotal => !!t);
}

export function totalAmount(rounds: Round[]): number {
  return rounds.reduce((sum, r) => sum + r.sharedAmount + r.drinkAmount, 0);
}
