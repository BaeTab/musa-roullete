import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TileRoulette, { type TileRouletteHandle, type TileItem } from '../components/TileRoulette';
import { ChevronLeft } from '../components/icons';
import type { MenuCategory, RouletteType } from '../data/menuData';
import { pageTransition, pageVariants } from '../lib/motion';
import { miniConfetti } from '../lib/confetti';
import { getRecentMenuNames } from '../lib/localHistory';

interface Props {
  type: RouletteType;
  category: MenuCategory;
  onBack: () => void;
  onMenuChosen: (menu: string) => void;
}

export default function MenuScreen({ type, category, onBack, onMenuChosen }: Props) {
  const tileRef = useRef<TileRouletteHandle>(null);
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState<string | null>(null);

  const items: TileItem[] = useMemo(
    () => category.items.map((item, i) => ({ id: `${i}`, label: item })),
    [category],
  );

  const excludeIds = useMemo(() => {
    const recent = new Set(getRecentMenuNames(6));
    return items.filter((item) => recent.has(item.label)).map((item) => item.id);
  }, [items]);

  const handleSpin = () => {
    setLanded(null);
    tileRef.current?.spin();
  };

  const handleSpinEnd = (item: TileItem) => {
    setSpinning(false);
    setLanded(item.label);
    miniConfetti();
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
        <h1 className="head-title">{category.name} 메뉴</h1>
        <p className="head-sub">세부 메뉴를 뽑아볼까요?</p>
      </div>

      <TileRoulette
        ref={tileRef}
        items={items}
        accent={type.accent}
        soft={type.soft}
        disabled={spinning}
        excludeIds={excludeIds}
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
                <span className="landed-label">오늘의 메뉴</span>
                <span className="landed-value">{landed}</span>
              </span>
              <button type="button" className="cta-btn cta-btn--compact" onClick={() => onMenuChosen(landed)}>
                결과 확인
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
