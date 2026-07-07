# 오늘 뭐 먹지? 🎡 결정장애 룰렛

선택은 룰렛에게, 맛집은 서귀포에서. 식사 / 안주 / 디저트 룰렛으로 카테고리 → 세부 메뉴까지 정하고, 바로 네이버에서 "서귀포 OO 맛집"을 검색할 수 있는 모바일 우선 웹앱입니다.

🔗 **배포 주소**: https://musa-roulette.web.app

## 기능

- **3가지 룰렛 타입**: 식사, 안주, 디저트
- **카테고리 룰렛**: 타입별 세부 카테고리(한식/중식/일식/양식/분식/고기·구이/세계음식 등)를 돌림판으로 선택
- **메뉴 룰렛**: 카테고리 안의 세부 메뉴를 타일 체이스 애니메이션으로 선택 (항목이 많아도 글씨가 작아지지 않도록 휠 대신 타일 방식 사용)
- **네이버 맛집 검색**: 결과 메뉴로 "서귀포 {메뉴} 맛집" 네이버 검색을 새 탭에서 바로 실행
- **공유하기**: Web Share API 지원 기기에서는 네이티브 공유 시트, 미지원 브라우저는 클립보드 복사로 대체
- **Firestore 연동**: 선택 결과를 `pickStats`(누적 카운트)와 `pickHistory`(최근 기록)에 저장하고, 홈 화면에 실시간 픽 티커로 노출
- **화려한 애니메이션**: framer-motion 화면 전환, 스핀/타일 체이스 애니메이션, 컨페티(canvas-confetti)
- **모바일 우선 반응형**: 최대 480px 폭 중앙 정렬 레이아웃, safe-area 대응

## 기술 스택

- React 19 + TypeScript + Vite
- framer-motion (애니메이션), canvas-confetti (컨페티)
- Firebase Hosting + Firestore
- Pretendard / Jua 웹폰트

## 로컬 개발

```bash
npm install
npm run dev
```

### 환경 변수

Firebase 프로젝트 설정값을 `.env.local`에 넣어야 합니다 (`.env.example` 참고):

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

## 빌드 / 배포

```bash
npm run build
firebase deploy
```

- `firebase.json` / `.firebaserc` / `firestore.rules` / `firestore.indexes.json`가 이미 구성되어 있고, 기본 프로젝트는 `musa-roulette`입니다.
- `main` 브랜치에 푸시하면 GitHub Actions(`.github/workflows/deploy.yml`)가 자동으로 빌드 후 Firebase Hosting + Firestore Rules를 배포합니다.
- CI는 `FIREBASE_SERVICE_ACCOUNT_MUSA_ROULETTE` 리포지토리 시크릿(서비스 계정 JSON)을 사용합니다.

## 프로젝트 구조

```
src/
  data/menuData.ts      # 룰렛 타입 · 카테고리 · 메뉴 데이터
  components/           # Wheel(카테고리 룰렛), TileRoulette(메뉴 룰렛), RecentPicksTicker
  screens/              # Home / Category / Menu / Result 화면
  lib/                  # firebase, stats(Firestore), naver(검색 URL), share, confetti, color, motion
```
