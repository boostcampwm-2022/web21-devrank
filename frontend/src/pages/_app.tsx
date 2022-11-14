import type { AppProps } from 'next/app';
import GlobalStyles from '@styles/globalStyles';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  );
}
