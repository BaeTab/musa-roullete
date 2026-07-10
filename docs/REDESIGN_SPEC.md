# 리디자인 세부 스펙 v3 — "Toss-grade Neutral"

> 작성: 기획 총괄 (Fable) / 구현: Opus / 저위험 작업: Sonnet
> 목표: 2026년 한국 네이티브 앱 수준의 완성도. 토스/당근마켓의 절제된 뉴트럴 + 액센트 1색 문법.

## 0. 절대 원칙 (위반 시 리젝)

1. **UI 크롬(버튼, 네비, 툴바, 탭, 라벨)에 이모지 금지.** 아이콘은 전부 인라인 SVG.
   - 이모지는 **음식 콘텐츠**(타입 카드 아이콘, 슬롯 릴 항목, 결과 메뉴명 옆)에만 허용.
2. **중앙정렬 헤더 금지.** 모든 화면 타이틀은 좌측 정렬. (예외: 결과 카드 내부만 중앙 허용 — 축하 모먼트)
3. **대문자 영문 eyebrow 금지.** "TODAY'S ROULETTE" 류 전부 삭제.
4. **액센트 컬러는 1색.** 그 외 모든 UI는 그레이스케일. 카테고리 구분색도 타입당 1색으로 축소.
5. **배경 그라디언트/그레인 텍스처 금지.** 플랫 `#F2F4F6`.

## 1. 디자인 토큰 (`src/index.css` `:root` 전면 교체)

```css
/* 컬러 */
--bg: #F2F4F6;            /* 앱 배경 (토스 그레이) */
--surface: #FFFFFF;        /* 카드/시트 */
--surface-dim: #F9FAFB;    /* 눌림/비활성 서페이스 */
--text-strong: #191F28;    /* 타이틀 (토스 블랙) */
--text: #333D4B;           /* 본문 */
--text-sub: #6B7684;       /* 보조 */
--text-faint: #8B95A1;     /* 캡션/비활성 */
--line: #E5E8EB;           /* 헤어라인 */
--accent: #FF6F0F;         /* 유일한 액센트 (당근 오렌지) */
--accent-soft: #FFF3E9;    /* 액센트 10% 틴트 배경 */
--accent-press: #E86300;   /* 액센트 눌림 */
--naver: #03C75A;          /* 네이버 CTA 전용 */

/* 타이포 (Pretendard 단일) */
--font: 'Pretendard', system-ui, sans-serif;
/* 스케일: 타이틀 26px/800, 섹션 20px/700, 리스트타이틀 17px/700,
   본문 15px/500, 캡션 13px/500, 버튼 16px/700. letter-spacing -0.02em(타이틀만) */

/* 라운드 */
--radius-card: 20px;
--radius-btn: 14px;
--radius-chip: 10px;
--radius-full: 999px;

/* 그림자 — 거의 안 씀. 분리는 배경 대비로 */
--shadow-card: 0 1px 3px rgba(0,0,0,0.05);
--shadow-float: 0 6px 20px rgba(0,0,0,0.10);  /* 바텀시트/토스트만 */

/* 간격: 4px 스케일. 화면 좌우 패딩 20px. 섹션 간 24~32px */
```

- `color-scheme: light`, `body` 배경 플랫 `var(--bg)`. `body::before` 그레인 삭제.
- `index.html`: `theme-color` → `#F2F4F6`. 폰트는 Pretendard만 유지.
- `prefers-reduced-motion` 블록 유지.

## 2. SVG 아이콘 세트 (`src/components/icons.tsx` 신규)

24×24 viewBox, `stroke="currentColor"`, `strokeWidth 1.8`, `fill="none"`, round cap/join.
컴포넌트: `ChevronRight`, `ChevronLeft`, `Star`(외곽선), `StarFilled`, `Share`, `Download`,
`Trophy`, `Clock`, `Users`, `Refresh`, `Home`, `LinkIcon`, `Dice`(주사위 또는 셔플).
props: `size?: number`(기본 24), `className?`. 색은 currentColor 상속.

## 3. 데이터 컬러 정리 (`src/data/menuData.ts`)

타입당 1색으로 축소. 카테고리 `color`는 소속 타입의 액센트를 그대로 사용.

| 타입 | accent | soft(아이콘 배경) |
|---|---|---|
| 식사 meal | `#FF6F0F` | `#FFF3E9` |
| 안주 anju | `#6D5EF4` | `#F1EFFE` |
| 디저트 dessert | `#F04E98` | `#FDEEF5` |

- `RouletteType.gradient` → `accent: string; soft: string` 두 필드로 교체 (사용처 전부 수정).
- 모든 `MenuCategory.color` = 소속 타입 accent.
- shareCard.ts의 gradient 참조도 accent 단색 기반으로 수정 (아래 §9).

## 4. 공통 컴포넌트 스펙

### 4.1 화면 헤더 (모든 서브 화면 공통 패턴)
```
[← 뒤로버튼: 40×40 터치영역, ChevronLeft 24px, text-strong]
[타이틀 26px/800 text-strong 좌측정렬, 상단 여백 8px]
[서브타이틀 15px/500 text-sub, 상단 여백 6px]
```
- back-btn: 배경 없음, 아이콘만. 텍스트("← 처음으로") 제거.

### 4.2 리스트 카드 (`menu-list` 리팩터)
- 컨테이너: white, radius 20, `--shadow-card`, 행 사이 1px `--line` (마지막 행 제외).
- 행: 높이 72px 내외, 패딩 16px 20px. 좌: 아이콘 스퀘어 44×44 radius 12 `type.soft` 배경 + 이모지 22px. 중: 타이틀 17px/700 `text-strong` + 서브 13px `text-faint`. 우: ChevronRight 20px `text-faint`.
- `:active` → `--surface-dim` 배경.

### 4.3 CTA 버튼 & 하단 바
- `.cta-btn`: 높이 56px, radius 14, bg `--accent`, 텍스트 16px/700 white. 눌림: `--accent-press` + scale 0.98. 비활성: bg `#DFE3E8`, 텍스트 `#8B95A1` (opacity 트릭 금지 — 명시적 색).
- 스피닝 중 라벨: "돌리는 중..." + 텍스트 좌측에 작은 스피너(2px 보더 회전) 허용.
- `.bottom-bar`: fixed, `max-width 480px`, 패딩 12px 20px + safe-area, 배경 `rgba(242,244,246,0.85)` + `backdrop-filter: blur(12px)`, 상단 1px `--line`.
- landed 시트: white radius 16, `--shadow-float`, 좌 라벨 13px `text-faint` + 값 18px/800, 우 컴팩트 CTA(높이 48px).

### 4.4 칩 / 탭 / 토스트
- 칩(결과 카테고리 표시): `type.soft` 배경, `type.accent` 텍스트 13px/700, radius full, 패딩 6px 12px. **이모지 제거, 텍스트만.**
- 탭(히스토리): 기존 세그먼트 유지하되 배경 `#E5E8EB` → 활성 white + `--shadow-card`, 텍스트 14px/700.
- 토스트: bg `#191F28E6`, white 14px/600, radius full, `--shadow-float`.

## 5. 화면별 스펙

### 5.1 홈 (`HomeScreen.tsx`)
```
(상단 여백 16px)
오늘 뭐 먹지?            ← 26px/800 좌측정렬 (스피닝 이모지 삭제)
룰렛이 대신 골라드릴게요    ← 15px text-sub

[리스트 카드: 식사 / 안주 / 디저트 3행 — §4.2]

[퀵액션 3분할 행]  ← 카드 3개 등폭, white radius 16, 세로: SVG아이콘 22px text-sub + 라벨 13px/600
   Users "함께 정하기" | Trophy "랭킹" | Clock "기록"

(하단 고정 아님, 리스트 아래 자연 배치)
[라이브 티커]: 카드 배경 제거 → 좌측 액센트 점(6px) + 13px text-faint 텍스트 한 줄, 중앙정렬 아님(좌측)
```
- 툴바(우상단 pill 버튼 3개) **삭제** → 퀵액션 행으로 대체.

### 5.2 카테고리 선택 — **슬롯 릴로 교체** (`SlotReel.tsx` 신규, `Wheel.tsx`/`Wheel.css` 삭제)
파이 원판 폐기. 세로 슬롯머신 릴:
- 컨테이너: white 카드, radius 20, 높이 5행×64px=320px, overflow hidden, 위/아래 32%씩 white→transparent 페이드 마스크(::before/::after).
- 중앙 행 인디케이터: 릴 뒤 고정 레이어 — `type.soft` 배경 pill(radius 12, 좌우 12px 인셋) + 좌측 3px `type.accent` 세로 바.
- 행: 64px, 가로 중앙에 [이모지 22px + 카테고리명 18px/700 text-strong]. 비중앙 행: opacity 0.3, scale 0.92 (framer-motion으로 거리 기반).
- 스핀: 전체 3~4루프 + 타깃 오프셋까지 translateY 애니메이션, duration 2.8s, ease `[0.12, 0.8, 0.2, 1]`. 완료 시 중앙 행 pill이 살짝 펄스(scale 1→1.04→1).
- API는 기존 Wheel과 동일하게 `forwardRef` + `spin()`, `onSpinStart/onSpinEnd(segment)` — CategoryScreen 수정 최소화.
- 화면 헤더: §4.1 (타이틀 "식사 카테고리", 서브 "룰렛을 돌려 카테고리를 정해보세요"). STEP 라벨/이모지 타이틀 제거.
- 하단 바: §4.3. CTA 라벨 "룰렛 돌리기" (이모지 없음).

### 5.3 메뉴 선택 (`MenuScreen.tsx` + `TileRoulette` 리스타일)
타일 체이스 인터랙션 유지, 비주얼 재정의:
- 그리드: 3열(메뉴명 6자 이상 많으면 자동 3열 고정), gap 8px, max-height 52vh.
- 기본 타일: white, radius 14, border 1px `--line`, 텍스트 15px/600 `--text`, min-height 56px. **컬러 보더/틴트사이클 제거** — `tintCycle`, `color.ts` 사용처 삭제.
- 체이스 활성: border 1.5px `type.accent`, bg `type.soft`, 텍스트 `type.accent`, scale 1.04.
- 위너: bg `type.accent`, 텍스트 white/700, spring 펄스(박스섀도 링). 나머지: opacity 0.35.
- 헤더/하단 바: §4.1/§4.3 동일 문법.

### 5.4 결과 (`ResultScreen.tsx`)
- 결과 카드: white radius 20 `--shadow-card`, 패딩 36px 24px, **내부만 중앙정렬 허용**. 상단 컬러바 삭제.
  ```
  [카테고리 칩 — §4.4, 텍스트만: "식사 · 분식"]
  [메뉴명 34px/900 text-strong + 뒤에 이모지 1개(카테고리 이모지) 허용]
  [점선 디바이더 유지]
  ["오늘은 이거 어때요?" 15px text-sub]
  [우상단 즐겨찾기: Star/StarFilled SVG, 40×40, 활성 시 accent]
  ```
- 액션 스택 (이모지 → SVG 아이콘 좌측 배치로 전면 교체):
  1. 네이버 CTA: 높이 56, radius 14, bg `--naver`, white 16px/700 "네이버에서 서귀포 맛집 찾기" (아이콘 없이 텍스트만, "N" 흉내 금지)
  2. 보조 버튼 2개를 **한 행 2분할**: [Share "공유하기"] [Download "카드 저장"] — white, border `--line`, 텍스트 15px/600 text
  3. 하단 행: [Refresh "다시 뽑기"] [Home "처음으로"] — 텍스트 버튼 스타일(배경 없음, text-sub), 중앙 정렬 행
- 컨페티 유지 (팔레트는 §9).

### 5.5 히스토리/랭킹 (`HistoryScreen`, `RankingScreen`)
- 헤더 §4.1 (이모지 타이틀 제거: "기록", "인기 랭킹"). eyebrow 삭제.
- pick-row/rank-row: white radius 16, border 삭제하고 `--shadow-card`만. 메뉴명 16px/700 text-strong.
- 랭킹 1~3위: 메달 이모지 대신 **숫자 뱃지** — 28px 원형, 1위 `--accent` bg white 텍스트, 2·3위 `#E5E8EB` bg text-sub, 4위 이하 배경 없음 text-faint.
- 즐겨찾기 삭제 ✕ → SVG X 또는 텍스트 "삭제"(13px text-faint).

### 5.6 함께 정하기 (`PartyStartScreen`, `PartyRoomScreen`)
- 헤더 §4.1 ("함께 정하기" / 서브 안내). TOGETHER eyebrow, 👥 제거.
- vote-row: white radius 14, 게이지 bar는 `type.soft`→유지, 내 투표 표시: 좌측 3px accent 바 + 체크 SVG. 득표수 13px/700 text-sub.
- 초대 링크 버튼: LinkIcon + "초대 링크 복사" (§5.4 보조 버튼 스타일).
- 결과 카드는 §5.4 문법 재사용.

## 6. 모션 스펙 (`src/lib/motion.ts`)

- 화면 전환: `opacity 0→1` + `y 12→0`, 240ms, `[0.2, 0, 0, 1]`. (x 슬라이드 → y로 교체, 네이티브 감)
- 리스트 진입: 카드 컨테이너 1회만 stagger 없이 fade+y (요소별 stagger 금지 — 과함).
- 버튼: `whileTap={{ scale: 0.98 }}` 통일.
- 슬롯 릴/타일 체이스: §5.2/5.3.
- 결과 카드: spring `{ stiffness: 260, damping: 20 }`, scale 0.92→1.

## 7. 파일 작업 계획

**Opus (핵심 구현):**
- 수정: `index.html`, `src/index.css`, `src/App.css`(전면 재작성), `src/App.tsx`(전환 variants만), `src/lib/motion.ts`, `src/data/menuData.ts`, 전 스크린 6종, `src/components/TileRoulette.tsx/.css`, `src/components/RecentPicksTicker.tsx`
- 신규: `src/components/icons.tsx`, `src/components/SlotReel.tsx`, `src/components/SlotReel.css`
- 삭제: `src/components/Wheel.tsx`, `src/components/Wheel.css`, `src/lib/color.ts`(사용처 제거 후)
- 완료 조건: `npx tsc -b --noEmit` 무오류, `npm run lint` 신규 경고 없음

**Sonnet (저위험):**
- `public/manifest.webmanifest`: background/theme `#F2F4F6`
- `src/lib/confetti.ts`: 팔레트 `['#FF6F0F', '#FFB067', '#6D5EF4', '#F04E98', '#191F28']`
- `README.md`: 디자인 섹션을 본 스펙 요지로 갱신
- `src/lib/shareCard.ts`: §9 참조

## 8. 수용 기준 (검수 체크리스트)

- [ ] 버튼/네비/탭/툴바 어디에도 이모지 없음 (grep으로 검증)
- [ ] 모든 화면 타이틀 좌측 정렬, eyebrow 클래스 삭제됨
- [ ] 배경 플랫 `#F2F4F6`, 그레인/그라디언트 없음
- [ ] 액센트성 컬러는 accent 3종(타입별)+naver 외 없음
- [ ] 파이 원판 완전 제거, 슬롯 릴 동작
- [ ] tsc/lint 통과, 전 플로우(홈→카테고리→메뉴→결과→히스토리/랭킹/파티) 화면 확인

## 9. shareCard 이미지 스펙 (Sonnet)

- 배경: 단색 `type.accent` (그라디언트 제거) + 하단 20% `rgba(0,0,0,0.08)` 오버레이
- 텍스트 배치 동일, 폰트 지정에서 "Bagel Fat One" 제거 → `800 Pretendard`
- 푸터 문구 "오늘 뭐 먹지? · musa-roulette.web.app" 13px
