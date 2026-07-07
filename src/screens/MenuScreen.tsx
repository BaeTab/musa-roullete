import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TileRoulette, { type TileRouletteHandle, type TileItem } from '../components/TileRoulette';
import type { MenuCategory, RouletteType } from '../data/menuData';
import { pageTransition, pageVariants } from '../lib/motion';
import { tintCycle } from '../lib/color';
import { miniConfetti } from '../lib/confetti';

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

  const items: TileItem[] = useMemo(() => {
    const colors = tintCycle(category.color, category.items.length);
    return category.items.map((item, i) => ({
      id: `${i}`,
      label: item,
      color: colors[i],
    }));
  }, [category]);

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
      className="screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <button type="button" className="back-btn" onClick={onBack}>
        ← {type.name} 카테고리 다시
      </button>

      <h2 className="screen-title">
        {category.emoji} {category.name} 메뉴 룰렛
      </h2>
      <p className="screen-desc">이제 세부 메뉴를 뽑아볼까요?</p>

      <TileRoulette
        ref={tileRef}
        items={items}
        disabled={spinning}
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
        {spinning ? '돌아가는 중...' : '메뉴 룰렛 돌리기 🎲'}
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
              오늘의 메뉴: <b>{landed}</b>
            </p>
            <motion.button
              type="button"
              className="primary-btn"
              whileTap={{ scale: 0.96 }}
              onClick={() => onMenuChosen(landed)}
            >
              결과 확인하기 →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
