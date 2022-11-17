import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from 'styled-components';
import { Noto_Sans_KR } from '@next/font/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Layout from '@components/Layout';
import GlobalStyles from '@styles/globalStyles';
import theme from '@styles/theme';

const notoSansKR = Noto_Sans_KR({
  weight: ['100', '300', '400', '500', '700', '900'],
});

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Devrank</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <div className={notoSansKR.className}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </div>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default appWithTranslation(App);
