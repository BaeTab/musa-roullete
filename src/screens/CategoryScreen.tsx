import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Wheel, { type WheelHandle, type WheelSegment } from '../components/Wheel';
import type { MenuCategory, RouletteType } from '../data/menuData';
import { pageTransition, pageVariants } from '../lib/motion';
import { miniConfetti } from '../lib/confetti';

interface Props {
  type: RouletteType;
  onBack: () => void;
  onCategoryChosen: (category: MenuCategory) => void;
}

export default function CategoryScreen({ type, onBack, onCategoryChosen }: Props) {
  const wheelRef = useRef<WheelHandle>(null);
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState<MenuCategory | null>(null);

  const segments: WheelSegment[] = type.categories.map((c) => ({
    id: c.id,
    label: c.name,
    emoji: c.emoji,
    color: c.color,
  }));

  const handleSpin = () => {
    setLanded(null);
    wheelRef.current?.spin();
  };

  const handleSpinEnd = (seg: WheelSegment) => {
    setSpinning(false);
    const category = type.categories.find((c) => c.id === seg.id);
    if (category) {
      setLanded(category);
      miniConfetti();
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

      <h2 className="screen-title">
        {type.emoji} {type.name} 카테고리 룰렛
      </h2>
      <p className="screen-desc">룰렛을 돌려서 오늘의 카테고리를 정해보세요</p>

      <Wheel
        ref={wheelRef}
        segments={segments}
        disabled={spinning}
        centerEmoji={type.emoji}
        onSpinStart={() => setSpinning(true)}
        onSpinEnd={handleSpinEnd}
      />

      <motion.button
        type="button"
        className="spin-btn"
        onClick={handleSpin}
        disabled={spinning}
        whileTap={{ scale: 0.96 }}
      >
        {spinning ? '돌아가는 중...' : '카테고리 룰렛 돌리기 🎲'}
      </motion.button>

      <AnimatePresence>
        {landed && !spinning && (
          <motion.div
            className="result-banner"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
          >
            <p>
              선택된 카테고리: <b>{landed.emoji} {landed.name}</b>
            </p>
            <motion.button
              type="button"
              className="primary-btn"
              whileTap={{ scale: 0.96 }}
              onClick={() => onCategoryChosen(landed)}
            >
              메뉴 뽑으러 가기 →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
