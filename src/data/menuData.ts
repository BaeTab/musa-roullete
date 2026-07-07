export interface MenuCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
  items: string[];
}

export interface RouletteType {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  gradient: [string, string];
  categories: MenuCategory[];
}

export const ROULETTE_TYPES: RouletteType[] = [
  {
    id: 'meal',
    name: '식사',
    tagline: '든든하게 한 끼',
    emoji: '🍽️',
    gradient: ['#FF6B35', '#F7931E'],
    categories: [
      {
        id: 'korean',
        name: '한식',
        emoji: '🍚',
        color: '#FF6B6B',
        items: [
          '김치찌개', '된장찌개', '순두부찌개', '부대찌개', '삼겹살', '갈비탕',
          '냉면', '비빔밥', '제육볶음', '닭갈비', '보쌈', '족발',
          '순대국밥', '감자탕', '낙지볶음', '육회', '잡채', '떡갈비', '한정식', '물회',
        ],
      },
      {
        id: 'chinese',
        name: '중식',
        emoji: '🥢',
        color: '#FFA94D',
        items: [
          '짜장면', '짬뽕', '탕수육', '마라탕', '마라샹궈', '양꼬치',
          '딤섬', '볶음밥', '유산슬', '물만두', '고추잡채', '마파두부',
          '깐풍기', '유린기', '훠궈', '멘보샤', '팔보채',
        ],
      },
      {
        id: 'japanese',
        name: '일식',
        emoji: '🍣',
        color: '#4DABF7',
        items: [
          '초밥', '라멘', '우동', '소바', '돈까스', '규동',
          '텐동', '오코노미야키', '사케동', '가라아게', '오니기리', '나베',
          '스키야키', '몬자야키', '야키토리', '카레라이스', '우나기동',
        ],
      },
      {
        id: 'western',
        name: '양식',
        emoji: '🍝',
        color: '#69DB7C',
        items: [
          '파스타', '피자', '스테이크', '리조또', '함박스테이크', '브런치',
          '샐러드', '스프', '오믈렛', '그라탕', '부리또볼', '버거',
          '샌드위치', '감바스', '뇨끼',
        ],
      },
      {
        id: 'bunsik',
        name: '분식',
        emoji: '🍢',
        color: '#FF8787',
        items: [
          '떡볶이', '김밥', '순대', '튀김', '라면', '오뎅',
          '만두', '쫄면', '라볶이', '핫도그', '계란빵', '충무김밥', '주먹밥',
        ],
      },
      {
        id: 'meat',
        name: '고기·구이',
        emoji: '🍖',
        color: '#E8590C',
        items: [
          '삼겹살', '목살', '갈비', '곱창', '막창', '치킨',
          '삼계탕', '훈제오리', '스테이크', '양꼬치', '닭발', '대창', '항정살',
        ],
      },
      {
        id: 'world',
        name: '세계음식',
        emoji: '🌍',
        color: '#9775FA',
        items: [
          '멕시코 타코', '베트남 쌀국수', '태국 팟타이', '인도 커리', '인도네시아 나시고랭',
          '터키 케밥', '스페인 감바스', '그리스 지로스', '하와이안 포케', '브라질 슈하스코',
          '싱가폴 락사', '말레이 나시르막', '필리핀 시니강', '프랑스 크레페', '멕시코 부리또', '베트남 반미',
        ],
      },
    ],
  },
  {
    id: 'anju',
    name: '안주',
    tagline: '한 잔엔 역시',
    emoji: '🍻',
    gradient: ['#7C3AED', '#EC4899'],
    categories: [
      {
        id: 'fried',
        name: '튀김안주',
        emoji: '🍗',
        color: '#FCC419',
        items: [
          '후라이드치킨', '양념치킨', '감자튀김', '오징어튀김', '새우튀김',
          '탕수육', '나쵸', '치즈스틱', '팝콘치킨', '핫윙',
        ],
      },
      {
        id: 'spicy',
        name: '매콤안주',
        emoji: '🌶️',
        color: '#FF6B6B',
        items: [
          '닭발', '무뼈닭발', '곱창볶음', '낙지볶음', '매운족발',
          '불막창', '매운감자탕', '쭈꾸미볶음',
        ],
      },
      {
        id: 'pancake',
        name: '전·부침개',
        emoji: '🥞',
        color: '#FAB005',
        items: [
          '파전', '감자전', '두부김치', '계란말이', '김치전',
          '해물파전', '부추전', '감자채전',
        ],
      },
      {
        id: 'dry',
        name: '마른안주',
        emoji: '🥜',
        color: '#868E96',
        items: [
          '노가리', '먹태', '육포', '땅콩', '트러플감자칩', '뻥튀기', '쥐포', '견과류믹스',
        ],
      },
      {
        id: 'dish',
        name: '안주요리',
        emoji: '🦑',
        color: '#22B8CF',
        items: [
          '모듬회', '조개찜', '소시지야채볶음', '골뱅이소면', '낙지탕탕이',
          '문어숙회', '새우장', '마늘종햄볶음',
        ],
      },
    ],
  },
  {
    id: 'dessert',
    name: '디저트',
    tagline: '달콤함이 필요해',
    emoji: '🍰',
    gradient: ['#FF9A9E', '#C471ED'],
    categories: [
      {
        id: 'cafe',
        name: '카페디저트',
        emoji: '🍰',
        color: '#F783AC',
        items: [
          '케이크', '마카롱', '크로플', '타르트', '티라미수',
          '스콘', '초콜릿브라우니', '치즈케이크', '에그타르트',
        ],
      },
      {
        id: 'bingsu',
        name: '빙수·아이스크림',
        emoji: '🍧',
        color: '#3BC9DB',
        items: [
          '팥빙수', '망고빙수', '딸기빙수', '젤라또', '소프트아이스크림', '인절미빙수', '요거트아이스크림',
        ],
      },
      {
        id: 'bakery',
        name: '베이커리·전통간식',
        emoji: '🥐',
        color: '#FFD43B',
        items: [
          '붕어빵', '호떡', '도넛', '크루아상', '약과', '인절미', '찹쌀떡', '계란빵', '와플',
        ],
      },
      {
        id: 'drink',
        name: '음료',
        emoji: '🧋',
        color: '#B197FC',
        items: [
          '버블티', '스무디', '프라페', '에이드', '밀크티', '아포가토', '딸기라떼', '초코라떼',
        ],
      },
    ],
  },
];

export function getRouletteType(typeId: string): RouletteType | undefined {
  return ROULETTE_TYPES.find((t) => t.id === typeId);
}

export function getCategory(typeId: string, categoryId: string): MenuCategory | undefined {
  return getRouletteType(typeId)?.categories.find((c) => c.id === categoryId);
}
