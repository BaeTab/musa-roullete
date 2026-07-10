import { useState } from 'react';
import { motion } from 'framer-motion';
import { ROULETTE_TYPES, type RouletteType } from '../data/menuData';
import { pageTransition, pageVariants } from '../lib/motion';
import { ChevronLeft, ChevronRight } from '../components/icons';
import { createPartySession } from '../lib/party';

interface Props {
  onBack: () => void;
  onSessionCreated: (sessionId: string) => void;
}

export default function PartyStartScreen({ onBack, onSessionCreated }: Props) {
  const [creating, setCreating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePick = async (type: RouletteType) => {
    setCreating(type.id);
    setError(null);
    try {
      const sessionId = await createPartySession(type);
      onSessionCreated(sessionId);
    } catch (err) {
      console.warn('[party] create session failed', err);
      setError('투표방을 만들지 못했어요. 잠시 후 다시 시도해주세요.');
      setCreating(null);
    }
  };

  return (
    <motion.div
      className="screen"
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
        <h1 className="head-title">함께 정하기</h1>
        <p className="head-sub">타입을 고르면 투표방이 만들어져요. 링크를 공유해 같이 골라보세요</p>
      </div>

      <div className="list-card">
        {ROULETTE_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            className="list-row"
            onClick={() => handlePick(type)}
            disabled={!!creating}
          >
            <span className="list-row-icon" style={{ background: type.soft }}>
              {type.emoji}
            </span>
            <span className="list-row-main">
              <span className="list-row-title">{type.name}</span>
              <span className="list-row-sub">
                {creating === type.id ? '투표방 만드는 중...' : type.tagline}
              </span>
            </span>
            <ChevronRight size={20} className="list-row-chevron" />
          </button>
        ))}
      </div>

      {error && <p className="error-text">{error}</p>}
    </motion.div>
  );
}
