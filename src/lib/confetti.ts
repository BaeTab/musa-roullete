import confetti from 'canvas-confetti';

const COLORS = ['#FF6B6B', '#FFD43B', '#69DB7C', '#4DABF7', '#9775FA', '#FF9A9E'];

export function burstConfetti(): void {
  confetti({ particleCount: 100, spread: 100, origin: { y: 0.45 }, colors: COLORS, startVelocity: 48 });

  const end = Date.now() + 900;
  (function frame() {
    confetti({ particleCount: 3, angle: 60, spread: 60, origin: { x: 0, y: 0.6 }, colors: COLORS });
    confetti({ particleCount: 3, angle: 120, spread: 60, origin: { x: 1, y: 0.6 }, colors: COLORS });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

export function miniConfetti(): void {
  confetti({ particleCount: 36, spread: 65, origin: { y: 0.5 }, scalar: 0.8, colors: COLORS });
}
