import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Layout from '@components/Layout';
import GlobalStyles from '@styles/globalStyles';
import theme from '@styles/theme';
import { lineSeedKR } from '@utils/fonts';

const queryErrorHandler = (error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
  }
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      onError: queryErrorHandler,
    },
    mutations: {
      onError: queryErrorHandler,
    },
  },
});

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Devrank</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <div className={lineSeedKR.className}>
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
