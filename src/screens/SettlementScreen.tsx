import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, pageVariants } from '../lib/motion';
import { ChevronLeft, Plus, Trash, Receipt } from '../components/icons';
import {
  type Participant,
  type Round,
  makeParticipant,
  makeRound,
  computeTotals,
  totalAmount,
  formatWon,
} from '../lib/settlement';
import { shareOrDownloadReceipt } from '../lib/receiptCard';

interface Props {
  onBack: () => void;
}

const RECEIPT_FEEDBACK: Record<string, string> = {
  shared: '영수증을 공유했어요!',
  downloaded: '영수증 이미지를 저장했어요',
  failed: '영수증 생성에 실패했어요',
};

function createDefaultParticipants(): Participant[] {
  return [makeParticipant('참가자 1'), makeParticipant('참가자 2')];
}

export default function SettlementScreen({ onBack }: Props) {
  const [participants, setParticipants] = useState<Participant[]>(createDefaultParticipants);
  const [rounds, setRounds] = useState<Round[]>(() => [makeRound('1차', participants.map((p) => p.id))]);
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const addParticipant = () => {
    const p = makeParticipant(`참가자 ${participants.length + 1}`);
    setParticipants((prev) => [...prev, p]);
    setRounds((prev) => prev.map((r) => ({ ...r, participantIds: [...r.participantIds, p.id] })));
  };

  const removeParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
    setRounds((prev) => prev.map((r) => ({ ...r, participantIds: r.participantIds.filter((pid) => pid !== id) })));
  };

  const updateParticipantName = (id: string, name: string) => {
    setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  const toggleDrinker = (id: string) => {
    setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, drinker: !p.drinker } : p)));
  };

  const addRound = () => {
    setRounds((prev) => [...prev, makeRound(`${prev.length + 1}차`, participants.map((p) => p.id))]);
  };

  const removeRound = (id: string) => {
    setRounds((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRoundLabel = (id: string, label: string) => {
    setRounds((prev) => prev.map((r) => (r.id === id ? { ...r, label } : r)));
  };

  const handleAmountChange = (id: string, field: 'sharedAmount' | 'drinkAmount', raw: string) => {
    const digits = raw.replace(/[^0-9]/g, '');
    setRounds((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: digits ? Number(digits) : 0 } : r)));
  };

  const setRoundParticipants = (id: string, ids: string[]) => {
    setRounds((prev) => prev.map((r) => (r.id === id ? { ...r, participantIds: ids } : r)));
  };

  const toggleRoundParticipant = (roundId: string, participantId: string) => {
    setRounds((prev) =>
      prev.map((r) => {
        if (r.id !== roundId) return r;
        const included = r.participantIds.includes(participantId);
        return {
          ...r,
          participantIds: included
            ? r.participantIds.filter((id) => id !== participantId)
            : [...r.participantIds, participantId],
        };
      }),
    );
  };

  const totals = useMemo(() => computeTotals(participants, rounds), [participants, rounds]);
  const grandTotal = useMemo(() => totalAmount(rounds), [rounds]);

  const handleSaveReceipt = async () => {
    if (participants.length === 0 || grandTotal <= 0) return;
    setSaving(true);
    try {
      const now = new Date();
      const dateLabel = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
      const result = await shareOrDownloadReceipt({
        dateLabel,
        rounds: rounds.map((r) => ({
          label: r.label || '차수',
          sharedAmount: r.sharedAmount,
          drinkAmount: r.drinkAmount,
          participantCount: r.participantIds.length,
          drinkerCount: r.participantIds.filter((id) => participants.find((p) => p.id === id)?.drinker).length,
        })),
        people: totals.map((t) => ({
          name: t.participant.name || '이름없음',
          total: t.total,
          drinker: t.participant.drinker,
        })),
        totalAmount: grandTotal,
      });
      setToast(RECEIPT_FEEDBACK[result]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className="screen screen--with-bar"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <button type="button" className="top-back" onClick={onBack} aria-label="뒤로">
        <ChevronLeft />
      </button>

      <div className="head">
        <h1 className="head-title">정산 계산기</h1>
        <p className="head-sub">차수마다 공통 금액과 주류 금액을 따로 나눠서 계산해요</p>
      </div>

      <div className="settle-section">
        <span className="settle-section-label">참가자 {participants.length}명</span>
        <div className="member-list">
          {participants.map((p) => (
            <div className="member-row" key={p.id}>
              <input
                type="text"
                className="field-input field-input--name"
                value={p.name}
                placeholder="이름"
                onChange={(e) => updateParticipantName(p.id, e.target.value)}
              />
              <button
                type="button"
                className={`drink-toggle ${p.drinker ? 'drink-toggle--on' : ''}`}
                onClick={() => toggleDrinker(p.id)}
              >
                {p.drinker ? '음주' : '무음주'}
              </button>
              <button
                type="button"
                className="icon-btn-ghost"
                onClick={() => removeParticipant(p.id)}
                aria-label="참가자 삭제"
              >
                <Trash size={18} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="add-row-btn" onClick={addParticipant}>
          <Plus size={18} />
          참가자 추가
        </button>
      </div>

      {participants.length === 0 ? (
        <p className="empty-state">참가자를 먼저 추가해주세요</p>
      ) : (
        <>
          <div className="settle-section">
            <span className="settle-section-label">차수 {rounds.length}개</span>
            <div className="round-list">
              {rounds.map((round) => {
                const includedCount = round.participantIds.length;
                const drinkerCount = round.participantIds.filter(
                  (id) => participants.find((p) => p.id === id)?.drinker,
                ).length;
                const drinkPoolCount = drinkerCount > 0 ? drinkerCount : includedCount;

                const sharedPerPerson =
                  includedCount > 0 && round.sharedAmount > 0
                    ? formatWon(Math.floor(round.sharedAmount / includedCount / 10) * 10)
                    : null;
                const drinkPerPerson =
                  drinkPoolCount > 0 && round.drinkAmount > 0
                    ? formatWon(Math.floor(round.drinkAmount / drinkPoolCount / 10) * 10)
                    : null;

                const noteParts: string[] = [];
                if (includedCount > 0) {
                  noteParts.push(`${includedCount}명 참여`);
                  if (sharedPerPerson) noteParts.push(`공통 1인당 ${sharedPerPerson}`);
                  if (drinkPerPerson) {
                    noteParts.push(
                      drinkerCount > 0
                        ? `주류는 음주자 ${drinkerCount}명이 ${drinkPerPerson}씩`
                        : `음주자가 없어 주류도 전체가 ${drinkPerPerson}씩`,
                    );
                  }
                } else {
                  noteParts.push('참여자를 선택해주세요');
                }

                return (
                  <div className="round-card" key={round.id}>
                    <div className="round-card-head">
                      <input
                        type="text"
                        className="field-input field-input--label"
                        value={round.label}
                        placeholder="차수명"
                        onChange={(e) => updateRoundLabel(round.id, e.target.value)}
                      />
                      <button
                        type="button"
                        className="icon-btn-ghost"
                        onClick={() => removeRound(round.id)}
                        aria-label="차수 삭제"
                      >
                        <Trash size={18} />
                      </button>
                    </div>

                    <div className="round-amount-group">
                      <span className="field-label">공통 금액 · 다같이 분담 (식사·안주 등)</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="field-input field-input--amount"
                        value={round.sharedAmount ? round.sharedAmount.toLocaleString('ko-KR') : ''}
                        placeholder="0"
                        onChange={(e) => handleAmountChange(round.id, 'sharedAmount', e.target.value)}
                      />
                    </div>

                    <div className="round-amount-group">
                      <span className="field-label">주류 금액 · 음주자만 분담 (선택)</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="field-input field-input--amount"
                        value={round.drinkAmount ? round.drinkAmount.toLocaleString('ko-KR') : ''}
                        placeholder="0"
                        onChange={(e) => handleAmountChange(round.id, 'drinkAmount', e.target.value)}
                      />
                    </div>

                    <div className="round-card-quick">
                      <button
                        type="button"
                        className="text-chip"
                        onClick={() => setRoundParticipants(round.id, participants.map((p) => p.id))}
                      >
                        전체 참여
                      </button>
                    </div>

                    <div className="chip-row">
                      {participants.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          className={`chip ${round.participantIds.includes(p.id) ? 'chip--active' : ''}`}
                          onClick={() => toggleRoundParticipant(round.id, p.id)}
                        >
                          {p.name || '이름없음'}
                        </button>
                      ))}
                    </div>

                    <p className="round-card-note">{noteParts.join(' · ')}</p>
                  </div>
                );
              })}
            </div>
            <button type="button" className="add-row-btn" onClick={addRound}>
              <Plus size={18} />
              차수 추가
            </button>
          </div>

          <div className="settle-section">
            <span className="settle-section-label">정산 결과</span>
            <div className="settle-total">
              <span className="settle-total-label">총 합계</span>
              <span className="settle-total-value">{formatWon(grandTotal)}</span>
            </div>
            <div className="list-card">
              {totals.map((t) => (
                <div className="settle-person-row" key={t.participant.id}>
                  <span className="settle-person-name">
                    {t.participant.name || '이름없음'}
                    {!t.participant.drinker && <span className="settle-person-tag">무음주</span>}
                  </span>
                  <span className="settle-person-amount">{formatWon(t.total)}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="bottom-bar">
        <button
          type="button"
          className="cta-btn"
          onClick={handleSaveReceipt}
          disabled={saving || participants.length === 0 || grandTotal <= 0}
        >
          {saving ? (
            <>
              <span className="cta-spinner" />
              저장하는 중...
            </>
          ) : (
            <>
              <Receipt size={20} />
              영수증 저장
            </>
          )}
        </button>
      </div>

      {toast && <div className="share-toast">{toast}</div>}
    </motion.div>
  );
}
