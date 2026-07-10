import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SlotReel, { type SlotReelHandle, type SlotSegment } from '../components/SlotReel';
import { ChevronLeft } from '../components/icons';
import type { MenuCategory, RouletteType } from '../data/menuData';
import { pageTransition, pageVariants } from '../lib/motion';
import { miniConfetti } from '../lib/confetti';

interface Props {
  type: RouletteType;
  onBack: () => void;
  onCategoryChosen: (category: MenuCategory) => void;
}

export default function CategoryScreen({ type, onBack, onCategoryChosen }: Props) {
  const reelRef = useRef<SlotReelHandle>(null);
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState<MenuCategory | null>(null);

  const segments: SlotSegment[] = type.categories.map((c) => ({
    id: c.id,
    label: c.name,
    emoji: c.emoji,
  }));

  const handleSpin = () => {
    setLanded(null);
    reelRef.current?.spin();
  };

  const handleSpinEnd = (seg: SlotSegment) => {
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
      <button type="button" className="top-back" onClick={onBack} aria-label="뒤로">
        <ChevronLeft />
      </button>

      <div className="head">
        <h1 className="head-title">{type.name} 카테고리</h1>
        <p className="head-sub">룰렛을 돌려 카테고리를 정해보세요</p>
      </div>

      <SlotReel
        ref={reelRef}
        segments={segments}
        accent={type.accent}
        soft={type.soft}
        disabled={spinning}
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
                <span className="landed-value">
                  {landed.emoji} {landed.name}
                </span>
              </span>
              <button type="button" className="cta-btn cta-btn--compact" onClick={() => onCategoryChosen(landed)}>
                다음
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
              {spinning ? (
                <>
                  <span className="cta-spinner" />
                  돌리는 중...
                </>
              ) : (
                '룰렛 돌리기'
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
