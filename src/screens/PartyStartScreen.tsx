import { useState } from 'react';
import { motion } from 'framer-motion';
import { ROULETTE_TYPES, type RouletteType } from '../data/menuData';
import { pageTransition, pageVariants } from '../lib/motion';
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
      <button type="button" className="back-btn" onClick={onBack}>
        ← 처음으로
      </button>

      <span className="eyebrow">TOGETHER</span>
      <h2 className="screen-title">👥 함께 정하기</h2>
      <p className="screen-desc">타입을 고르면 투표방이 만들어져요. 링크를 공유해서 같이 골라보세요!</p>

      <div className="menu-list">
        {ROULETTE_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            className="menu-row"
            onClick={() => handlePick(type)}
            disabled={!!creating}
          >
            <span className="menu-row-icon" style={{ background: type.gradient[0] }}>
              {type.emoji}
            </span>
            <span className="menu-row-body">
              <span className="menu-row-title">{type.name}</span>
              <span className="menu-row-sub">{creating === type.id ? '투표방 만드는 중...' : type.tagline}</span>
            </span>
            <span className="menu-row-chevron">›</span>
          </button>
        ))}
      </div>

      {error && <p className="empty-state">{error}</p>}
    </motion.div>
  );
}
