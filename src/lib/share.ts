export type ShareResult = 'shared' | 'copied' | 'failed';

export async function shareResult(payload: {
  typeName: string;
  categoryName: string;
  menu: string;
}): Promise<ShareResult> {
  const text = `오늘 뭐 먹지? 룰렛이 정해준 메뉴는 "${payload.menu}"! (${payload.typeName} · ${payload.categoryName}) 너도 룰렛 돌려봐 🎡`;
  const url = window.location.origin;

  if (navigator.share) {
    try {
      await navigator.share({ title: '오늘 뭐 먹지? 결정장애 룰렛', text, url });
      return 'shared';
    } catch (err) {
      if ((err as Error).name === 'AbortError') return 'failed';
    }
  }

  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    return 'copied';
  } catch {
    return 'failed';
  }
}
