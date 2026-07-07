const REGION = '서귀포';

export function buildNaverSearchUrl(menu: string): string {
  const query = `${REGION} ${menu} 맛집`;
  return `https://search.naver.com/search.naver?query=${encodeURIComponent(query)}`;
}

export function openNaverSearch(menu: string): void {
  window.open(buildNaverSearchUrl(menu), '_blank', 'noopener,noreferrer');
}
