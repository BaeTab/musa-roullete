export interface ShareCardPayload {
  typeName: string;
  typeEmoji: string;
  categoryName: string;
  categoryEmoji: string;
  menu: string;
  gradient: [string, string];
}

const WIDTH = 1080;
const HEIGHT = 1350;

function fitFontSize(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, startSize: number, minSize: number): number {
  let size = startSize;
  ctx.font = `400 ${size}px "Bagel Fat One", Pretendard, sans-serif`;
  while (ctx.measureText(text).width > maxWidth && size > minSize) {
    size -= 6;
    ctx.font = `400 ${size}px "Bagel Fat One", Pretendard, sans-serif`;
  }
  return size;
}

async function ensureFontsReady(): Promise<void> {
  try {
    await document.fonts.load('400 120px "Bagel Fat One"');
    await document.fonts.load('400 32px Pretendard');
    await document.fonts.ready;
  } catch {
    /* canvas will fall back to default fonts */
  }
}

export async function generateShareCard(payload: ShareCardPayload): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  await ensureFontsReady();

  const bgGrad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bgGrad.addColorStop(0, payload.gradient[0]);
  bgGrad.addColorStop(1, payload.gradient[1]);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const radial = ctx.createRadialGradient(WIDTH * 0.24, HEIGHT * 0.16, 0, WIDTH * 0.24, HEIGHT * 0.16, WIDTH * 0.75);
  radial.addColorStop(0, 'rgba(255,255,255,0.3)');
  radial.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';

  ctx.font = '400 34px Pretendard, sans-serif';
  ctx.globalAlpha = 0.88;
  ctx.fillText(`${payload.typeEmoji} ${payload.typeName} · ${payload.categoryEmoji} ${payload.categoryName}`, WIDTH / 2, HEIGHT * 0.36);
  ctx.globalAlpha = 1;

  const menuFontSize = fitFontSize(ctx, payload.menu, WIDTH * 0.82, 128, 56);
  ctx.font = `400 ${menuFontSize}px "Bagel Fat One", Pretendard, sans-serif`;
  ctx.fillText(payload.menu, WIDTH / 2, HEIGHT * 0.49);

  ctx.font = '400 32px Pretendard, sans-serif';
  ctx.globalAlpha = 0.85;
  ctx.fillText('오늘의 선택은 바로 이거예요!', WIDTH / 2, HEIGHT * 0.58);
  ctx.globalAlpha = 1;

  ctx.font = '700 30px Pretendard, sans-serif';
  ctx.globalAlpha = 0.95;
  ctx.fillText('오늘 뭐 먹지? 🎡 결정장애 룰렛', WIDTH / 2, HEIGHT * 0.92);
  ctx.globalAlpha = 1;

  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/png'));
}

export type ShareCardResult = 'shared' | 'downloaded' | 'failed';

export async function shareOrDownloadCard(payload: ShareCardPayload): Promise<ShareCardResult> {
  const blob = await generateShareCard(payload);
  if (!blob) return 'failed';

  const file = new File([blob], `오늘뭐먹지-${payload.menu}.png`, { type: 'image/png' });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: '오늘 뭐 먹지? 결정장애 룰렛', text: `오늘의 메뉴는 "${payload.menu}"!` });
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
