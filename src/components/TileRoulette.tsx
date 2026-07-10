import { forwardRef, useImperativeHandle, useRef, useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import './TileRoulette.css';

export interface TileItem {
  id: string;
  label: string;
}

export interface TileRouletteHandle {
  spin: () => void;
}

interface TileRouletteProps {
  items: TileItem[];
  accent: string;
  soft: string;
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
  ({ items, accent, soft, disabled, excludeIds, onSpinStart, onSpinEnd }, ref) => {
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

    return (
      <div className={`tile-grid ${disabled ? 'tile-grid--disabled' : ''}`}>
        {items.map((item, i) => {
          const isActive = activeIndex === i;
          const isWinner = isActive && !spinning;
          const isDim = spinning && !isActive;
          const style: CSSProperties | undefined =
            isActive || isWinner
              ? {
                  borderColor: accent,
                  background: isWinner ? accent : soft,
                  color: isWinner ? '#fff' : accent,
                  ['--tile-accent' as string]: accent,
                }
              : undefined;
          return (
            <motion.div
              key={item.id}
              className={`tile ${isActive ? 'tile--active' : ''} ${isWinner ? 'tile--winner' : ''} ${isDim ? 'tile--dim' : ''}`}
              style={style}
              animate={isActive ? { scale: 1.04 } : { scale: 1 }}
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
