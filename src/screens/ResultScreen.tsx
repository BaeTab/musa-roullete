import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { MenuCategory, RouletteType } from '../data/menuData';
import { pageTransition, pageVariants } from '../lib/motion';
import { burstConfetti } from '../lib/confetti';
import { buildNaverSearchUrl, openNaverSearch } from '../lib/naver';
import { recordPick } from '../lib/stats';
import { shareResult } from '../lib/share';

interface Props {
  type: RouletteType;
  category: MenuCategory;
  menu: string;
  onRespin: () => void;
  onRestart: () => void;
}

const SHARE_FEEDBACK: Record<string, string> = {
  shared: '공유했어요! 🎉',
  copied: '클립보드에 복사했어요 📋',
  failed: '공유에 실패했어요',
};

export default function ResultScreen({ type, category, menu, onRespin, onRestart }: Props) {
  const recorded = useRef(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  useEffect(() => {
    burstConfetti();
    if (!recorded.current) {
      recorded.current = true;
      recordPick({
        typeId: type.id,
        typeName: type.name,
        categoryId: category.id,
        categoryName: category.name,
        menu,
      });
    }
  }, [type, category, menu]);

  useEffect(() => {
    if (!shareMessage) return;
    const timer = window.setTimeout(() => setShareMessage(null), 2200);
    return () => window.clearTimeout(timer);
  }, [shareMessage]);

  const handleShare = async () => {
    const result = await shareResult({ typeName: type.name, categoryName: category.name, menu });
    setShareMessage(SHARE_FEEDBACK[result]);
  };

  return (
    <motion.div
      className="screen result-screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <motion.div
        className="result-card"
        style={{ background: `linear-gradient(150deg, ${type.gradient[0]}, ${type.gradient[1]})` }}
        initial={{ scale: 0.7, opacity: 0, rotate: -6 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.1 }}
      >
        <span className="result-eyebrow">
          {type.emoji} {type.name} · {category.emoji} {category.name}
        </span>
        <span className="result-menu">{menu}</span>
        <span className="result-caption">오늘의 선택은 바로 이거예요!</span>
      </motion.div>

      <motion.a
        className="naver-btn"
        href={buildNaverSearchUrl(menu)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          e.preventDefault();
          openNaverSearch(menu);
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        whileTap={{ scale: 0.96 }}
      >
        네이버에서 서귀포 {menu} 맛집 찾기
      </motion.a>

      <motion.button
        type="button"
        className="share-btn"
        onClick={handleShare}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileTap={{ scale: 0.96 }}
      >
        📤 결과 공유하기
      </motion.button>

      <AnimatePresence>
        {shareMessage && (
          <motion.div
            className="share-toast"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            {shareMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="result-actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <button type="button" className="ghost-btn" onClick={onRespin}>
          🔁 메뉴 다시 뽑기
        </button>
        <button type="button" className="ghost-btn" onClick={onRestart}>
          🏠 처음으로
        </button>
      </motion.div>
    </motion.div>
  );
}
