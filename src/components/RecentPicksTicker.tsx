import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchRecentPicks, type PickRecord } from '../lib/stats';

export default function RecentPicksTicker() {
  const [picks, setPicks] = useState<PickRecord[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetchRecentPicks(8).then((data) => {
        if (!cancelled && data.length) setPicks(data);
      });
    };
    load();
    const poll = window.setInterval(load, 20000);
    return () => {
      cancelled = true;
      window.clearInterval(poll);
    };
  }, []);

  useEffect(() => {
    if (picks.length < 2) return;
    const cycle = window.setInterval(() => setIndex((i) => (i + 1) % picks.length), 3200);
    return () => window.clearInterval(cycle);
  }, [picks.length]);

  if (picks.length === 0) return null;

  const current = picks[index % picks.length];

  return (
    <div className="ticker">
      <span className="ticker-dot" />
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28 }}
          className="ticker-text"
        >
          방금 누군가 <b>{current.menu}</b>을(를) 선택했어요
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
