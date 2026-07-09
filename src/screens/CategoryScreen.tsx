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
      className="screen screen--with-bar"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <button type="button" className="back-btn" onClick={onBack}>
        ← 처음으로
      </button>

      <span className="eyebrow">STEP 01 · 카테고리 선택</span>
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

      <div className="bottom-bar">
        <AnimatePresence mode="wait">
          {landed && !spinning ? (
            <motion.div
              key="landed"
              className="landed-sheet"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
            >
              <span className="landed-info">
                <span className="landed-label">선택된 카테고리</span>
                <span className="landed-value">{landed.emoji} {landed.name}</span>
              </span>
              <button type="button" className="cta-btn cta-btn--compact" onClick={() => onCategoryChosen(landed)}>
                다음 →
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="spin"
              type="button"
              className="cta-btn"
              onClick={handleSpin}
              disabled={spinning}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {spinning ? '돌아가는 중...' : '카테고리 룰렛 돌리기 🎲'}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
