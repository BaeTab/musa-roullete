import { motion } from 'framer-motion';
import { ROULETTE_TYPES, type RouletteType } from '../data/menuData';
import RecentPicksTicker from '../components/RecentPicksTicker';
import { pageTransition, pageVariants } from '../lib/motion';

interface Props {
  onSelectType: (type: RouletteType) => void;
  onOpenHistory: () => void;
  onOpenRanking: () => void;
  onOpenParty: () => void;
}

export default function HomeScreen({ onSelectType, onOpenHistory, onOpenRanking, onOpenParty }: Props) {
  return (
    <motion.div
      className="screen home-screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <div className="home-toolbar">
        <button type="button" className="icon-btn" onClick={onOpenParty} aria-label="함께 정하기">
          👥 함께
        </button>
        <button type="button" className="icon-btn" onClick={onOpenRanking} aria-label="인기 메뉴 랭킹">
          🏆 랭킹
        </button>
        <button type="button" className="icon-btn" onClick={onOpenHistory} aria-label="히스토리 및 즐겨찾기">
          📜 히스토리
        </button>
      </div>

      <div className="home-header">
        <span className="eyebrow">TODAY&apos;S ROULETTE · 서귀포</span>
        <motion.h1
          className="app-title"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          오늘 뭐 먹지? <span className="app-title-wheel">🎡</span>
        </motion.h1>
        <p className="app-subtitle">선택은 룰렛에게, 맛집은 서귀포에서</p>
      </div>

      <motion.div
        className="menu-list"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
      >
        {ROULETTE_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            className="menu-row"
            onClick={() => onSelectType(type)}
          >
            <span className="menu-row-icon" style={{ background: type.gradient[0] }}>
              {type.emoji}
            </span>
            <span className="menu-row-body">
              <span className="menu-row-title">{type.name}</span>
              <span className="menu-row-sub">{type.tagline}</span>
            </span>
            <span className="menu-row-chevron">›</span>
          </button>
        ))}
      </motion.div>

      <RecentPicksTicker />
    </motion.div>
  );
}
