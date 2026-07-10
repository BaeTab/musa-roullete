import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { MenuCategory, RouletteType } from '../data/menuData';
import { pageTransition, pageVariants } from '../lib/motion';
import { burstConfetti } from '../lib/confetti';
import { buildNaverSearchUrl, openNaverSearch } from '../lib/naver';
import { recordPick } from '../lib/stats';
import { shareResult } from '../lib/share';
import { addHistory, isFavorite, toggleFavorite } from '../lib/localHistory';
import { shareOrDownloadCard } from '../lib/shareCard';
import { Star, StarFilled, Share, Download, Refresh, Home } from '../components/icons';

interface Props {
  type: RouletteType;
  category: MenuCategory;
  menu: string;
  onRespin: () => void;
  onRestart: () => void;
}

const SHARE_FEEDBACK: Record<string, string> = {
  shared: '공유했어요!',
  copied: '클립보드에 복사했어요',
  failed: '공유에 실패했어요',
};

const CARD_FEEDBACK: Record<string, string> = {
  shared: '카드를 공유했어요!',
  downloaded: '카드 이미지를 저장했어요',
  failed: '이미지 생성에 실패했어요',
};

export default function ResultScreen({ type, category, menu, onRespin, onRestart }: Props) {
  const recorded = useRef(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [favorited, setFavorited] = useState(() => isFavorite(menu));

  const localPickPayload = {
    typeId: type.id,
    typeName: type.name,
    typeEmoji: type.emoji,
    categoryId: category.id,
    categoryName: category.name,
    categoryEmoji: category.emoji,
    menu,
  };

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
      addHistory(localPickPayload);
    }
    setFavorited(isFavorite(menu));
  }, [type, category, menu]);

  const handleToggleFavorite = () => {
    setFavorited(toggleFavorite(localPickPayload));
  };

  useEffect(() => {
    if (!shareMessage) return;
    const timer = window.setTimeout(() => setShareMessage(null), 2200);
    return () => window.clearTimeout(timer);
  }, [shareMessage]);

  const handleShare = async () => {
    const result = await shareResult({ typeName: type.name, categoryName: category.name, menu });
    setShareMessage(SHARE_FEEDBACK[result]);
  };

  const handleSaveCard = async () => {
    const result = await shareOrDownloadCard({
      typeName: type.name,
      typeEmoji: type.emoji,
      categoryName: category.name,
      categoryEmoji: category.emoji,
      menu,
      gradient: [type.accent, type.accent],
    });
    setShareMessage(CARD_FEEDBACK[result]);
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
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.05 }}
      >
        <button
          type="button"
          className={`favorite-toggle ${favorited ? 'favorite-toggle--on' : ''}`}
          onClick={handleToggleFavorite}
          aria-label={favorited ? '즐겨찾기 해제' : '즐겨찾기 추가'}
        >
          {favorited ? <StarFilled /> : <Star />}
        </button>
        <span className="result-chip" style={{ background: type.soft, color: type.accent }}>
          {type.name} · {category.name}
        </span>
        <span className="result-menu">
          {menu}
          <span className="result-menu-emoji">{category.emoji}</span>
        </span>
        <div className="result-divider" />
        <span className="result-caption">오늘은 이거 어때요?</span>
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
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.98 }}
      >
        네이버에서 서귀포 {menu} 맛집 찾기
      </motion.a>

      <motion.div
        className="result-secondary"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.36 }}
      >
        <button type="button" className="pill-btn" onClick={handleShare} aria-label="공유하기">
          <Share size={18} />
          공유하기
        </button>
        <button type="button" className="pill-btn" onClick={handleSaveCard} aria-label="카드 저장">
          <Download size={18} />
          카드 저장
        </button>
      </motion.div>

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
        className="result-text-row"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42 }}
      >
        <button type="button" className="text-btn" onClick={onRespin}>
          <Refresh size={18} />
          다시 뽑기
        </button>
        <button type="button" className="text-btn" onClick={onRestart}>
          <Home size={18} />
          처음으로
        </button>
      </motion.div>
    </motion.div>
  );
}
