import { LanguageMap } from '@type/common';

export const EXCEPTIONAL_LANGUAGE = ['rust'];

export const DEVICON_URL = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';

export const DEVRANK_REPOSITORY_URL = 'https://github.com/boostcampwm-2022/web21-devrank';

export const GITHUB_AUTH_REQUEST_URL = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&read=user`;

export const MAIN_PAGE_RANK_COUNT = 12;

export const COUNT_PER_PAGE = 10;

export const CACHE_TIME = 1000 * 60 * 2;

export const SEARCH_DEBOUNCE_DELAY = 300;

export const AUTO_COMPLETE_LIMIT = 5;

export const LANGUAGE_MAP: LanguageMap = {
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

export const CUBE_RANK_RANGE = {
  yellow: [0, 99],
  green: [100, 199],
  mint: [200, 299],
  blue: [300, 399],
  purple: [400, 499],
  orange: [500, 599],
  red: [600, 699],
};

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

export const MONTH_LIST = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
