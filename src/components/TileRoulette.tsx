import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './TileRoulette.css';

export interface TileItem {
  id: string;
  label: string;
  color: string;
}

export interface TileRouletteHandle {
  spin: () => void;
}

interface TileRouletteProps {
  items: TileItem[];
  disabled?: boolean;
  excludeIds?: string[];
  onSpinStart?: () => void;
  onSpinEnd?: (item: TileItem, index: number) => void;
}

const MIN_STEPS = 28;
const MIN_DELAY = 45;
const MAX_DELAY = 260;
const EASE_POWER = 2.2;

const TileRoulette = forwardRef<TileRouletteHandle, TileRouletteProps>(
  ({ items, disabled, excludeIds, onSpinStart, onSpinEnd }, ref) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [spinning, setSpinning] = useState(false);
    const timeoutRef = useRef<number | undefined>(undefined);

    useImperativeHandle(ref, () => ({
      spin() {
        if (spinning || items.length === 0) return;
        const n = items.length;
        const start = Math.floor(Math.random() * n);
        const eligible = excludeIds?.length
          ? items.map((_, i) => i).filter((i) => !excludeIds.includes(items[i].id))
          : [];
        const pool = eligible.length > 0 ? eligible : items.map((_, i) => i);
        const targetIndex = pool[Math.floor(Math.random() * pool.length)];
        const forward = ((targetIndex - start) % n + n) % n;
        const loops = Math.ceil((MIN_STEPS - forward) / n);
        const totalSteps = forward + Math.max(loops, 1) * n;

        setSpinning(true);
        onSpinStart?.();

        let step = 0;
        const tick = () => {
          setActiveIndex((start + step) % n);
          if (step >= totalSteps) {
            setSpinning(false);
            onSpinEnd?.(items[targetIndex], targetIndex);
            return;
          }
          const progress = step / totalSteps;
          const delay = MIN_DELAY + (MAX_DELAY - MIN_DELAY) * Math.pow(progress, EASE_POWER);
          step += 1;
          timeoutRef.current = window.setTimeout(tick, delay);
        };
        tick();
      },
    }));

    const columns = items.length <= 9 ? 3 : 4;

    return (
      <div
        className={`tile-grid ${disabled ? 'tile-grid--disabled' : ''}`}
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {items.map((item, i) => {
          const isActive = activeIndex === i;
          const isWinner = isActive && !spinning;
          const isDim = spinning && !isActive;
          return (
            <motion.div
              key={item.id}
              className={`tile ${isActive ? 'tile--active' : ''} ${isWinner ? 'tile--winner' : ''} ${isDim ? 'tile--dim' : ''}`}
              style={{ borderTopColor: item.color }}
              animate={isActive ? { scale: 1.08 } : { scale: 1 }}
              transition={{ duration: 0.15 }}
            >
              {item.label}
            </motion.div>
          );
        })}
      </div>
    );
  },
);

TileRoulette.displayName = 'TileRoulette';

export default TileRoulette;
