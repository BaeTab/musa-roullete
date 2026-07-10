import { useMemo, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, pageVariants } from '../lib/motion';
import { ChevronLeft } from '../components/icons';
import { getFavorites, getHistory, removeFavorite, type LocalPick } from '../lib/localHistory';

interface Props {
  onBack: () => void;
}

type Tab = 'history' | 'favorites';

function formatTime(ts: number): string {
  const diffMin = Math.round((Date.now() - ts) / 60000);
  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.round(diffHour / 24);
  return `${diffDay}일 전`;
}

function PickRow({ pick, trailing }: { pick: LocalPick; trailing?: ReactNode }) {
  return (
    <div className="pick-row">
      <div className="pick-row-main">
        <span className="pick-row-menu">{pick.menu}</span>
        <span className="pick-row-meta">
          {pick.typeEmoji} {pick.typeName} · {pick.categoryEmoji} {pick.categoryName}
        </span>
      </div>
      {trailing ?? <span className="pick-row-time">{formatTime(pick.pickedAt)}</span>}
    </div>
  );
}

export default function HistoryScreen({ onBack }: Props) {
  const [tab, setTab] = useState<Tab>('history');
  const [favoriteVersion, setFavoriteVersion] = useState(0);

  const history = useMemo(() => getHistory(), []);
  const favorites = useMemo(() => getFavorites(), [favoriteVersion]);

  const handleRemoveFavorite = (menu: string) => {
    removeFavorite(menu);
    setFavoriteVersion((v) => v + 1);
  };

  const list = tab === 'history' ? history : favorites;

  return (
    <motion.div
      className="screen"
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
        <h1 className="head-title">기록</h1>
        <p className="head-sub">지금까지 룰렛이 골라준 메뉴예요</p>
      </div>

      <div className="tab-switch">
        <button
          type="button"
          className={`tab-switch-btn ${tab === 'history' ? 'tab-switch-btn--active' : ''}`}
          onClick={() => setTab('history')}
        >
          최근 기록
        </button>
        <button
          type="button"
          className={`tab-switch-btn ${tab === 'favorites' ? 'tab-switch-btn--active' : ''}`}
          onClick={() => setTab('favorites')}
        >
          즐겨찾기 ({favorites.length})
        </button>
      </div>

      {list.length === 0 ? (
        <p className="empty-state">
          {tab === 'history'
            ? '아직 뽑은 메뉴가 없어요. 룰렛을 돌려보세요!'
            : '즐겨찾기한 메뉴가 없어요. 결과 화면에서 별을 눌러보세요.'}
        </p>
      ) : (
        <div className="pick-list">
          {list.map((pick) => (
            <PickRow
              key={pick.id}
              pick={pick}
              trailing={
                tab === 'favorites' ? (
                  <button
                    type="button"
                    className="pick-row-remove"
                    onClick={() => handleRemoveFavorite(pick.menu)}
                    aria-label="즐겨찾기 삭제"
                  >
                    삭제
                  </button>
                ) : undefined
              }
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
