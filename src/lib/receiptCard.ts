import { formatWon } from './settlement';

export interface ReceiptRound {
  label: string;
  amount: number;
  participantCount: number;
}

export interface ReceiptPerson {
  name: string;
  total: number;
  drinker: boolean;
}

export interface ReceiptPayload {
  dateLabel: string;
  rounds: ReceiptRound[];
  people: ReceiptPerson[];
  totalAmount: number;
}

const WIDTH = 720;
const PAD_X = 52;
const PAD_TOP = 48;
const PAD_BOTTOM = 40;
const TITLE_H = 46;
const SUBTITLE_H = 30;
const HEADER_GAP = 22;
const ROUND_ROW_H = 50;
const TOTAL_ROW_H = 84;
const SECTION_GAP = 30;
const LABEL_ROW_H = 34;
const PERSON_ROW_H = 58;
const FOOTER_GAP = 26;
const FOOTER_H = 40;
const ZIGZAG_H = 22;
const ZIGZAG_TOOTH_W = 24;

const INK = '#191f28';
const SUB = '#6b7684';
const FAINT = '#8b95a1';
const LINE = '#e5e8eb';
const ACCENT = '#ff6f0f';
const ACCENT_SOFT = '#fff3e9';

function computeHeight(payload: ReceiptPayload): number {
  return (
    PAD_TOP +
    TITLE_H +
    SUBTITLE_H +
    HEADER_GAP +
    16 +
    payload.rounds.length * ROUND_ROW_H +
    16 +
    TOTAL_ROW_H +
    SECTION_GAP +
    LABEL_ROW_H +
    payload.people.length * PERSON_ROW_H +
    FOOTER_GAP +
    FOOTER_H +
    PAD_BOTTOM +
    ZIGZAG_H
  );
}

async function ensureFontsReady(): Promise<void> {
  try {
    await document.fonts.load('800 34px Pretendard');
    await document.fonts.load('700 20px Pretendard');
    await document.fonts.load('500 18px Pretendard');
    await document.fonts.ready;
  } catch {
    /* canvas will fall back to default fonts */
  }
}

function roundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCardPath(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const zigzagTop = height - ZIGZAG_H;
  const teeth = Math.round(width / ZIGZAG_TOOTH_W);
  const toothW = width / teeth;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(width, 0);
  ctx.lineTo(width, zigzagTop);
  for (let i = teeth; i >= 0; i -= 1) {
    const x = i * toothW;
    const y = zigzagTop + (i % 2 === 0 ? ZIGZAG_H : 0);
    ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawDashed(ctx: CanvasRenderingContext2D, y: number, width: number): void {
  ctx.save();
  ctx.strokeStyle = LINE;
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 8]);
  ctx.beginPath();
  ctx.moveTo(PAD_X, y);
  ctx.lineTo(width - PAD_X, y);
  ctx.stroke();
  ctx.restore();
}

function truncate(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let out = text;
  while (out.length > 1 && ctx.measureText(`${out}…`).width > maxWidth) {
    out = out.slice(0, -1);
  }
  return `${out}…`;
}

export async function generateReceiptCard(payload: ReceiptPayload): Promise<Blob | null> {
  await ensureFontsReady();

  const height = computeHeight(payload);
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.save();
  drawCardPath(ctx, WIDTH, height);
  ctx.clip();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, WIDTH, height);
  ctx.restore();

  const centerX = WIDTH / 2;
  let y = PAD_TOP;

  ctx.textAlign = 'center';
  ctx.fillStyle = INK;
  ctx.font = '800 34px Pretendard, sans-serif';
  y += TITLE_H * 0.72;
  ctx.fillText('정산 영수증', centerX, y);

  ctx.font = '500 18px Pretendard, sans-serif';
  ctx.fillStyle = FAINT;
  y += SUBTITLE_H * 0.95;
  ctx.fillText(
    `${payload.dateLabel} · 참가자 ${payload.people.length}명 · ${payload.rounds.length}차수`,
    centerX,
    y,
  );

  y += HEADER_GAP;
  drawDashed(ctx, y, WIDTH);
  y += 16;

  payload.rounds.forEach((round) => {
    const rowY = y + ROUND_ROW_H / 2 + 7;

    ctx.textAlign = 'left';
    ctx.font = '700 20px Pretendard, sans-serif';
    ctx.fillStyle = INK;
    const label = `${round.label} · ${round.participantCount}명`;
    ctx.fillText(truncate(ctx, label, WIDTH - PAD_X * 2 - 180), PAD_X, rowY);

    ctx.textAlign = 'right';
    ctx.font = '700 20px Pretendard, sans-serif';
    ctx.fillStyle = SUB;
    ctx.fillText(formatWon(round.amount), WIDTH - PAD_X, rowY);

    y += ROUND_ROW_H;
  });

  y += 16;
  drawDashed(ctx, y, WIDTH);
  y += SECTION_GAP - HEADER_GAP;

  const boxX = PAD_X - 12;
  const boxW = WIDTH - boxX * 2;
  roundedRectPath(ctx, boxX, y, boxW, TOTAL_ROW_H, 18);
  ctx.fillStyle = ACCENT_SOFT;
  ctx.fill();

  ctx.textAlign = 'left';
  ctx.font = '700 18px Pretendard, sans-serif';
  ctx.fillStyle = ACCENT;
  ctx.fillText('총 합계', boxX + 20, y + TOTAL_ROW_H / 2 + 6);

  ctx.textAlign = 'right';
  ctx.font = '800 28px Pretendard, sans-serif';
  ctx.fillStyle = ACCENT;
  ctx.fillText(formatWon(payload.totalAmount), WIDTH - boxX - 20, y + TOTAL_ROW_H / 2 + 9);

  y += TOTAL_ROW_H + SECTION_GAP;

  ctx.textAlign = 'left';
  ctx.font = '700 15px Pretendard, sans-serif';
  ctx.fillStyle = SUB;
  ctx.fillText('인원별 정산', PAD_X, y + LABEL_ROW_H / 2 + 5);
  y += LABEL_ROW_H;

  payload.people.forEach((person, i) => {
    if (i > 0) {
      ctx.strokeStyle = LINE;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(PAD_X, y);
      ctx.lineTo(WIDTH - PAD_X, y);
      ctx.stroke();
    }

    const rowY = y + PERSON_ROW_H / 2 + 7;

    ctx.textAlign = 'left';
    ctx.font = '700 19px Pretendard, sans-serif';
    ctx.fillStyle = INK;
    const drawnName = truncate(ctx, person.name, 240);
    ctx.fillText(drawnName, PAD_X, rowY);

    if (!person.drinker) {
      const nameWidth = ctx.measureText(drawnName).width;
      ctx.font = '700 12px Pretendard, sans-serif';
      ctx.fillStyle = FAINT;
      ctx.fillText('무음주', PAD_X + nameWidth + 10, rowY - 1);
    }

    ctx.textAlign = 'right';
    ctx.font = '800 19px Pretendard, sans-serif';
    ctx.fillStyle = INK;
    ctx.fillText(formatWon(person.total), WIDTH - PAD_X, rowY);

    y += PERSON_ROW_H;
  });

  y += FOOTER_GAP;
  drawDashed(ctx, y, WIDTH);
  y += FOOTER_H * 0.7;

  ctx.textAlign = 'center';
  ctx.font = '600 15px Pretendard, sans-serif';
  ctx.fillStyle = FAINT;
  ctx.fillText('오늘 뭐 먹지? · musa-roulette.web.app', centerX, y);

  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/png'));
}

export type ReceiptResult = 'shared' | 'downloaded' | 'failed';

export async function shareOrDownloadReceipt(payload: ReceiptPayload): Promise<ReceiptResult> {
  const blob = await generateReceiptCard(payload);
  if (!blob) return 'failed';

  const file = new File([blob], `정산영수증-${payload.dateLabel}.png`, { type: 'image/png' });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: '정산 영수증',
        text: `총 ${formatWon(payload.totalAmount)} 정산 결과예요`,
      });
      return 'shared';
    } catch (err) {
      if ((err as Error).name === 'AbortError') return 'failed';
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return 'downloaded';
}
