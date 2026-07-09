import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, pageVariants } from '../lib/motion';
import { burstConfetti } from '../lib/confetti';
import { buildNaverSearchUrl, openNaverSearch } from '../lib/naver';
import {
  buildPartyShareUrl,
  castVote,
  closeVoting,
  getParticipantId,
  subscribeToParty,
  tallyVotes,
  type PartySession,
} from '../lib/party';

interface Props {
  sessionId: string;
  onExit: () => void;
}

export default function PartyRoomScreen({ sessionId, onExit }: Props) {
  const [session, setSession] = useState<PartySession | null | undefined>(undefined);
  const [toast, setToast] = useState<string | null>(null);
  const participantId = getParticipantId();

  useEffect(() => {
    return subscribeToParty(sessionId, setSession);
  }, [sessionId]);

  useEffect(() => {
    if (session?.status === 'done') burstConfetti();
  }, [session?.status]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  if (session === undefined) {
    return (
      <motion.div
        className="screen"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        <p className="empty-state">투표방을 불러오는 중...</p>
      </motion.div>
    );
  }

  if (session === null) {
    return (
      <motion.div
        className="screen"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        <p className="empty-state">투표방을 찾을 수 없어요. 링크가 만료되었을 수 있어요.</p>
        <button type="button" className="cta-btn" style={{ maxWidth: 320 }} onClick={onExit}>
          처음으로
        </button>
      </motion.div>
    );
  }

  const isHost = session.hostParticipantId === participantId;
  const tally = tallyVotes(session);
  const totalVotes = Object.values(tally).reduce((a, b) => a + b, 0);
  const myVote = session.votes[participantId];
  const winner = session.candidates.find((c) => c.id === session.winnerCandidateId);

  const handleCastVote = (candidateId: string) => {
    castVote(sessionId, candidateId).catch((err) => {
      console.warn('[party] castVote failed', err);
      setToast('투표에 실패했어요');
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(buildPartyShareUrl(sessionId));
      setToast('링크를 복사했어요 📋');
    } catch {
      setToast('복사에 실패했어요');
    }
  };

  const handleCloseVoting = () => {
    closeVoting(sessionId, session).catch((err) => {
      console.warn('[party] closeVoting failed', err);
      setToast('마감에 실패했어요');
    });
  };

  return (
    <motion.div
      className={`screen ${session.status === 'voting' ? 'screen--with-bar' : ''}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <button type="button" className="back-btn" onClick={onExit}>
        ← 처음으로
      </button>

      <span className="eyebrow">
        TOGETHER · {session.typeEmoji} {session.typeName}
      </span>
      <h2 className="screen-title">👥 함께 정하기</h2>
      <p className="screen-desc">
        {session.status === 'voting' ? `${totalVotes}명이 투표했어요` : '투표가 마감됐어요!'}
      </p>

      {session.status === 'voting' ? (
        <>
          <div className="pick-list">
            {session.candidates.map((c) => {
              const count = tally[c.id] ?? 0;
              const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
              const mine = myVote === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`vote-row ${mine ? 'vote-row--mine' : ''}`}
                  onClick={() => handleCastVote(c.id)}
                >
                  <span className="vote-row-bar" style={{ width: `${pct}%` }} />
                  <span className="vote-row-label">
                    {c.categoryEmoji} {c.menu}
                  </span>
                  <span className="vote-row-count">{count}표</span>
                </button>
              );
            })}
          </div>

          <button type="button" className="share-btn" onClick={handleCopyLink}>
            🔗 초대 링크 복사
          </button>

          <div className="bottom-bar">
            {isHost ? (
              <button type="button" className="cta-btn" onClick={handleCloseVoting}>
                투표 마감하고 결과 보기
              </button>
            ) : (
              <p className="screen-desc">방장이 투표를 마감하면 결과가 나와요</p>
            )}
          </div>
        </>
      ) : winner ? (
        <>
          <div className="result-card">
            <div
              className="result-card-bar"
              style={{ background: `linear-gradient(90deg, ${session.typeGradient[0]}, ${session.typeGradient[1]})` }}
            />
            <span className="result-eyebrow" style={{ background: session.typeGradient[0] }}>
              {session.typeEmoji} {session.typeName} · {winner.categoryEmoji} {winner.categoryName}
            </span>
            <span className="result-menu">{winner.menu}</span>
            <div className="result-divider" />
            <span className="result-caption">투표로 결정된 오늘의 메뉴예요!</span>
          </div>
          <a
            className="naver-btn"
            href={buildNaverSearchUrl(winner.menu)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              openNaverSearch(winner.menu);
            }}
          >
            네이버에서 서귀포 {winner.menu} 맛집 찾기
          </a>
          <button type="button" className="ghost-btn" style={{ width: '100%' }} onClick={onExit}>
            🏠 처음으로
          </button>
        </>
      ) : null}

      {toast && <div className="share-toast">{toast}</div>}
    </motion.div>
  );
}
