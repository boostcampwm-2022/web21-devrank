import { RANK } from '@type/common';

export const EXCEPTIONAL_LANGUAGE = ['rust'];

export const DEVICON_URL = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';

export const DEVRANK_REPOSITORY_URL = 'https://github.com/boostcampwm-2022/web21-devrank';

export const GITHUB_AUTH_REQUEST_URL = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=read:user%20read:org`;

export const MAIN_PAGE_RANK_COUNT = 12;

export const COUNT_PER_PAGE = 10;

export const CACHE_TIME = 1000 * 60 * 2;

export const SEARCH_DEBOUNCE_DELAY = 300;

export const AUTO_COMPLETE_LIMIT = 5;

export const KEYBOARD_KEY = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ESCAPE: 'Escape',
};

export const LANGUAGE_MAP: {
  [key: string]: string;
} = {
  'c++': 'cplusplus',
  'c#': 'csharp',
  html: 'html5',
  css: 'css3',
  vimscript: 'vim',
  jupyternotebook: 'jupyter',
};

export const CUBE_RANK = {
  ALL: 'all',
  YELLOW: 'yellow',
  GREEN: 'green',
  MINT: 'mint',
  BLUE: 'blue',
  PURPLE: 'purple',
  ORANGE: 'orange',
  RED: 'red',
} as const;

export const DEVELOPER_INFORMATION = [
  {
    name: '장우석',
    github: 'https://github.com/wkddntjr1123',
    blog: 'https://wkddntjr1123.github.io/',
    role: 'Backend',
    email: 'wkddntjr1123@gmail.com',
    introduction: '함께 일하고싶은 개발자 장우석입니다. 커피☕ 사주세요!',
  },
  {
    name: '강시온',
    github: 'https://github.com/Yaminyam',
    blog: 'https://velog.io/@siontama',
    role: 'Backend',
    email: 'siontama@gmail.com',
    introduction: '개발자를 위한 개발자 강시온 입니다',
  },
  {
    name: '정윤규',
    github: 'https://github.com/asdf99245',
    blog: '',
    role: 'Frontend',
    email: 'asdf99245@naver.com',
    introduction: '사용자를 먼저 이해하는 프론트엔드 엔지니어 정윤규입니다.',
  },
  {
    name: '정성윤',
    github: 'https://github.com/tunggary',
    blog: '',
    role: 'Frontend',
    email: 'tunggary2@navr.com',
    introduction: '최적화에 관심이 많은 프론트엔드 개발자 정성윤입니다.',
  },
];

export const MONTH_LABEL_MAPPING: {
  [key: string]: string;
} = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
};

export const CUBE_COLOR_MAP: {
  [key in RANK]: string;
} = {
  red: ' #f60b50',
  orange: '#f3753a',
  purple: '#c455fa',
  blue: '#558ef8',
  mint: '#33d7e0',
  green: '#3ac63a',
  yellow: '#ffe375',
};

export const MEDAL_IMG: {
  [key: number]: string;
} = {
  0: '/icons/ranking-1st.svg',
  1: '/icons/ranking-2nd.svg',
  2: '/icons/ranking-3rd.svg',
};

export const TIER_OFFSET = {
  green: 100,
  mint: 200,
  blue: 500,
  purple: 1000,
  orange: 2000,
  red: 5000,
} as const;
