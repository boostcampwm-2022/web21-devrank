import { Aldrich, Noto_Sans_KR } from '@next/font/google';
import localFont from '@next/font/local';

export const notoSansKR = Noto_Sans_KR({
  weight: ['100', '300', '400', '500', '700', '900'],
  subsets: ['latin'],
});

export const aldrich = Aldrich({
  weight: '400',
  subsets: ['latin'],
});

export const lineSeedKR = localFont({
  src: [
    {
      path: '../../public/fonts/line-seed-kr-thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/line-seed-kr-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/line-seed-kr-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
});
