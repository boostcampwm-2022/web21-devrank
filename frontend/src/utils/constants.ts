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
    github: '',
    blog: '',
    career: '1년',
    field: 'Backend',
    introduction: '안녕하세요. 장우석입니다.',
  },
  {
    name: '강시온',
    github: '',
    blog: '',
    career: '?년',
    field: 'Backend',
    introduction: '안녕하세요. 강시온입니다.',
  },
  {
    name: '정윤규',
    github: '',
    blog: '',
    career: '1년',
    field: 'Frontend',
    introduction: '안녕하세요. 정윤규입니다.',
  },
  {
    name: '정성윤',
    github: '',
    blog: '',
    career: '1년',
    field: 'Frontend',
    introduction: '안녕하세요. 정성윤입니다.',
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
