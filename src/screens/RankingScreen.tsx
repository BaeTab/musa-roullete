import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, pageVariants } from '../lib/motion';
import { ChevronLeft } from '../components/icons';
import { fetchTopPicks, type PickStat } from '../lib/stats';

interface Props {
  onBack: () => void;
}

function badgeClass(rank: number): string {
  if (rank === 0) return 'rank-badge rank-badge--first';
  if (rank === 1 || rank === 2) return 'rank-badge rank-badge--medal';
  return 'rank-badge';
}

export default function RankingScreen({ onBack }: Props) {
  const [ranking, setRanking] = useState<PickStat[] | null>(null);

  useEffect(() => {
    fetchTopPicks(20).then(setRanking);
  }, []);

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
        <h1 className="head-title">인기 랭킹</h1>
        <p className="head-sub">모두가 가장 많이 뽑은 메뉴예요</p>
      </div>

      {ranking === null ? (
        <p className="empty-state">불러오는 중...</p>
      ) : ranking.length === 0 ? (
        <p className="empty-state">아직 랭킹 데이터가 없어요. 룰렛을 돌려서 첫 기록을 남겨보세요!</p>
      ) : (
        <div className="pick-list">
          {ranking.map((stat, i) => (
            <div className="rank-row" key={`${stat.typeId}-${stat.categoryId}-${stat.menu}`}>
              <span className={badgeClass(i)}>{i + 1}</span>
              <div className="pick-row-main">
                <span className="pick-row-menu">{stat.menu}</span>
                <span className="pick-row-meta">
                  {stat.typeName} · {stat.categoryName}
                </span>
              </div>
              <span className="rank-count">{stat.count}회</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
