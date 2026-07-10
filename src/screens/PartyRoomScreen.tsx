import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, pageVariants } from '../lib/motion';
import { burstConfetti } from '../lib/confetti';
import { buildNaverSearchUrl, openNaverSearch } from '../lib/naver';
import { ChevronLeft, Check, LinkIcon, Home } from '../components/icons';
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
        <button type="button" className="cta-btn" onClick={onExit}>
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
      setToast('링크를 복사했어요');
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
      <button type="button" className="top-back" onClick={onExit} aria-label="뒤로">
        <ChevronLeft />
      </button>

      <div className="head">
        <h1 className="head-title">함께 정하기</h1>
        <p className="head-sub">
          {session.status === 'voting'
            ? `${session.typeName} · ${totalVotes}명이 투표했어요`
            : `${session.typeName} · 투표가 마감됐어요`}
        </p>
      </div>

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
                  <span className="vote-row-bar" style={{ width: `${pct}%`, background: session.typeSoft }} />
                  {mine && <span className="vote-row-mark" />}
                  <span className="vote-row-label">
                    {mine && <Check size={16} className="vote-row-check" />}
                    {c.categoryEmoji} {c.menu}
                  </span>
                  <span className="vote-row-count">{count}표</span>
                </button>
              );
            })}
          </div>

          <div className="result-secondary">
            <button type="button" className="pill-btn" onClick={handleCopyLink}>
              <LinkIcon size={18} />
              초대 링크 복사
            </button>
          </div>

          <div className="bottom-bar">
            {isHost ? (
              <button type="button" className="cta-btn" onClick={handleCloseVoting}>
                투표 마감하고 결과 보기
              </button>
            ) : (
              <p className="bottom-note">방장이 투표를 마감하면 결과가 나와요</p>
            )}
          </div>
        </>
      ) : winner ? (
        <>
          <div className="result-card">
            <span className="result-chip" style={{ background: session.typeSoft, color: session.typeAccent }}>
              {session.typeName} · {winner.categoryName}
            </span>
            <span className="result-menu">
              {winner.menu}
              <span className="result-menu-emoji">{winner.categoryEmoji}</span>
            </span>
            <div className="result-divider" />
            <span className="result-caption">투표로 정해진 오늘의 메뉴예요</span>
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
          <div className="result-text-row">
            <button type="button" className="text-btn" onClick={onExit}>
              <Home size={18} />
              처음으로
            </button>
          </div>
        </>
      ) : null}

      {toast && <div className="share-toast">{toast}</div>}
    </motion.div>
  );
}
