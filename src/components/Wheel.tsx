import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './Wheel.css';

export interface WheelSegment {
  id: string;
  label: string;
  emoji?: string;
  color: string;
}

export interface WheelHandle {
  spin: () => void;
}

interface WheelProps {
  segments: WheelSegment[];
  disabled?: boolean;
  onSpinStart?: () => void;
  onSpinEnd?: (segment: WheelSegment, index: number) => void;
  centerEmoji?: string;
}

const SPIN_DURATION = 4.4;

const Wheel = forwardRef<WheelHandle, WheelProps>(
  ({ segments, disabled, onSpinStart, onSpinEnd, centerEmoji }, ref) => {
    const [rotation, setRotation] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const rotationRef = useRef(0);

    const sliceAngle = 360 / segments.length;
    const labelScale = segments.length <= 8 ? 1 : Math.max(0.5, 8 / segments.length);
    const labelWidthPct = segments.length <= 8 ? 34 : Math.max(18, 34 - (segments.length - 8) * 1.1);

    const background = useMemo(() => {
      const stops = segments.map((seg, i) => {
        const from = (i / segments.length) * 100;
        const to = ((i + 1) / segments.length) * 100;
        return `${seg.color} ${from}% ${to}%`;
      });
      return `conic-gradient(from 0deg, ${stops.join(', ')})`;
    }, [segments]);

    useImperativeHandle(ref, () => ({
      spin() {
        if (spinning || segments.length === 0) return;
        const targetIndex = Math.floor(Math.random() * segments.length);
        const midAngle = targetIndex * sliceAngle + sliceAngle / 2;
        const jitter = (Math.random() - 0.5) * (sliceAngle * 0.6);
        const desiredMod = ((360 - (midAngle + jitter)) % 360 + 360) % 360;
        const currentMod = ((rotationRef.current % 360) + 360) % 360;
        const delta = ((desiredMod - currentMod) % 360 + 360) % 360;
        const extraSpins = 6 + Math.floor(Math.random() * 3);
        const nextRotation = rotationRef.current + extraSpins * 360 + delta;

        rotationRef.current = nextRotation;
        setSpinning(true);
        onSpinStart?.();
        setRotation(nextRotation);

        window.setTimeout(() => {
          setSpinning(false);
          onSpinEnd?.(segments[targetIndex], targetIndex);
        }, SPIN_DURATION * 1000);
      },
    }));

    return (
      <div className={`wheel-wrap ${disabled ? 'wheel-wrap--disabled' : ''}`}>
        <div className="wheel-pointer" aria-hidden="true" />
        <motion.div
          className="wheel-disc"
          style={{ background }}
          animate={{ rotate: rotation }}
          transition={{ duration: SPIN_DURATION, ease: [0.12, 0.72, 0.14, 1] }}
        >
          {segments.map((seg, i) => {
            const mid = i * sliceAngle + sliceAngle / 2;
            return (
              <div
                key={seg.id}
                className="wheel-segment-label"
                style={{ transform: `rotate(${mid}deg)` }}
              >
                <span
                  style={{
                    width: `${labelWidthPct}%`,
                    fontSize: `calc(clamp(0.6rem, 2.5vw, 0.8rem) * ${labelScale})`,
                  }}
                >
                  <em>{seg.emoji}</em>
                  {seg.label}
                </span>
              </div>
            );
          })}
        </motion.div>
        <div className="wheel-hub">
          <span>{centerEmoji ?? '🎯'}</span>
        </div>
      </div>
    );
  },
);

Wheel.displayName = 'Wheel';

export default Wheel;
