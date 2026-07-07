import { motion } from 'framer-motion';
import { ROULETTE_TYPES, type RouletteType } from '../data/menuData';
import RecentPicksTicker from '../components/RecentPicksTicker';
import { pageTransition, pageVariants } from '../lib/motion';

interface Props {
  onSelectType: (type: RouletteType) => void;
}

export default function HomeScreen({ onSelectType }: Props) {
  return (
    <motion.div
      className="screen home-screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <div className="home-header">
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

      <div className="type-card-list">
        {ROULETTE_TYPES.map((type, i) => (
          <motion.button
            key={type.id}
            type="button"
            className="type-card"
            style={{ background: `linear-gradient(135deg, ${type.gradient[0]}, ${type.gradient[1]})` }}
            onClick={() => onSelectType(type)}
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.09, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="type-card-emoji">{type.emoji}</span>
            <span className="type-card-name">{type.name}</span>
            <span className="type-card-tagline">{type.tagline}</span>
          </motion.button>
        ))}
      </div>

      <RecentPicksTicker />
    </motion.div>
  );
}
