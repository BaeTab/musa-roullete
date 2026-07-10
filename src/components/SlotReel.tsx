import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  animate,
  motion,
  useAnimationControls,
  useMotionValue,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import './SlotReel.css';

export interface SlotSegment {
  id: string;
  label: string;
  emoji?: string;
}

export interface SlotReelHandle {
  spin: () => void;
}

interface SlotReelProps {
  segments: SlotSegment[];
  accent: string;
  soft: string;
  disabled?: boolean;
  onSpinStart?: () => void;
  onSpinEnd?: (segment: SlotSegment, index: number) => void;
}

const ROW_H = 64;
const VISIBLE = 5;
const CENTER = (VISIBLE * ROW_H) / 2; // vertical center of the viewport
const REPEAT = 16; // how many times the segment list is stacked

// translateY that puts virtual row `k` in the center of the viewport
function yForCenter(k: number): number {
  return CENTER - (k * ROW_H + ROW_H / 2);
}

function SlotRow({ k, y, emoji, label }: { k: number; y: MotionValue<number>; emoji?: string; label: string }) {
  const dist = useTransform(y, (yv) => Math.abs(k * ROW_H + ROW_H / 2 + yv - CENTER) / ROW_H);
  const opacity = useTransform(dist, (d) => Math.max(0.3, 1 - d * 0.7));
  const scale = useTransform(dist, (d) => Math.max(0.92, 1 - d * 0.08));
  return (
    <motion.div className="slot-row" style={{ opacity, scale }}>
      {emoji && <span className="slot-row-emoji">{emoji}</span>}
      <span className="slot-row-label">{label}</span>
    </motion.div>
  );
}

const SlotReel = forwardRef<SlotReelHandle, SlotReelProps>(
  ({ segments, accent, soft, disabled, onSpinStart, onSpinEnd }, ref) => {
    const n = segments.length;
    const baseCenter = Math.floor(REPEAT / 2) * n; // a multiple of n, well inside the strip
    const currentK = useRef(baseCenter);
    const y = useMotionValue(yForCenter(baseCenter));
    const pill = useAnimationControls();
    const [spinning, setSpinning] = useState(false);

    const rows = useMemo(
      () => Array.from({ length: REPEAT * n }, (_, k) => ({ k, seg: segments[k % n] })),
      [segments, n],
    );

    useImperativeHandle(ref, () => ({
      spin() {
        if (spinning || n === 0) return;
        const startK = currentK.current;
        const targetIndex = Math.floor(Math.random() * n);
        const loops = 3 + Math.floor(Math.random() * 2); // 3~4 full loops
        const delta = (((targetIndex - (startK % n)) % n) + n) % n;
        const vFinal = startK + loops * n + delta;

        setSpinning(true);
        onSpinStart?.();

        animate(y, yForCenter(vFinal), {
          duration: 2.8,
          ease: [0.12, 0.8, 0.2, 1],
          onComplete: () => {
            // snap back to an equivalent centered index to keep headroom for the next spin
            const rest = baseCenter + targetIndex;
            currentK.current = rest;
            y.set(yForCenter(rest));
            setSpinning(false);
            pill.start({ scale: [1, 1.04, 1] }, { duration: 0.42, ease: 'easeInOut' });
            onSpinEnd?.(segments[targetIndex], targetIndex);
          },
        });
      },
    }));

    return (
      <div className={`slot-reel ${disabled ? 'slot-reel--disabled' : ''}`}>
        <motion.div className="slot-indicator" style={{ background: soft }} animate={pill}>
          <span className="slot-indicator-bar" style={{ background: accent }} />
        </motion.div>
        <motion.div className="slot-strip" style={{ y }}>
          {rows.map(({ k, seg }) => (
            <SlotRow key={k} k={k} y={y} emoji={seg.emoji} label={seg.label} />
          ))}
        </motion.div>
      </div>
    );
  },
);

SlotReel.displayName = 'SlotReel';

export default SlotReel;
