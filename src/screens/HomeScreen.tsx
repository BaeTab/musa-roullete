import { motion } from 'framer-motion';
import { ROULETTE_TYPES, type RouletteType } from '../data/menuData';
import RecentPicksTicker from '../components/RecentPicksTicker';
import { ChevronRight, Users, Trophy, Clock, Receipt } from '../components/icons';
import { pageTransition, pageVariants } from '../lib/motion';

interface Props {
  onSelectType: (type: RouletteType) => void;
  onOpenHistory: () => void;
  onOpenRanking: () => void;
  onOpenParty: () => void;
  onOpenSettlement: () => void;
}

export default function HomeScreen({
  onSelectType,
  onOpenHistory,
  onOpenRanking,
  onOpenParty,
  onOpenSettlement,
}: Props) {
  return (
    <motion.div
      className="screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <div className="head head--home">
        <h1 className="head-title">오늘 뭐 먹지?</h1>
        <p className="head-sub">룰렛이 대신 골라드릴게요</p>
      </div>

      <div className="list-card">
        {ROULETTE_TYPES.map((type) => (
          <button key={type.id} type="button" className="list-row" onClick={() => onSelectType(type)}>
            <span className="list-row-icon" style={{ background: type.soft }}>
              {type.emoji}
            </span>
            <span className="list-row-main">
              <span className="list-row-title">{type.name}</span>
              <span className="list-row-sub">{type.tagline}</span>
            </span>
            <ChevronRight size={20} className="list-row-chevron" />
          </button>
        ))}
      </div>

      <div className="quick-row">
        <button type="button" className="quick-btn" onClick={onOpenParty}>
          <Users size={22} />
          <span className="quick-btn-label">함께 정하기</span>
        </button>
        <button type="button" className="quick-btn" onClick={onOpenRanking}>
          <Trophy size={22} />
          <span className="quick-btn-label">랭킹</span>
        </button>
        <button type="button" className="quick-btn" onClick={onOpenHistory}>
          <Clock size={22} />
          <span className="quick-btn-label">기록</span>
        </button>
        <button type="button" className="quick-btn" onClick={onOpenSettlement}>
          <Receipt size={22} />
          <span className="quick-btn-label">정산</span>
        </button>
      </div>

      <RecentPicksTicker />
    </motion.div>
  );
}
