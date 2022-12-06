import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Layout from '@components/Layout';
import GlobalStyles from '@styles/globalStyles';
import theme from '@styles/theme';
import { CACHE_TIME } from '@utils/constants';
import { lineSeedKR } from '@utils/fonts';

function App({ Component, pageProps }: AppProps) {
  const queryErrorHandler = (error: unknown) => {
    if (error instanceof Error) {
      console.error(error.message);
    }
  };

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            retry: false,
            cacheTime: CACHE_TIME,
            onError: queryErrorHandler,
          },
          mutations: {
            onError: queryErrorHandler,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <div className={lineSeedKR.className}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </div>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </Hydrate>
    </QueryClientProvider>
  );
}

export default appWithTranslation(App);
