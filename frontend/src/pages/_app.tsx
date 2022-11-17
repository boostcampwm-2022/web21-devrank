import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { Noto_Sans_KR } from '@next/font/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Layout from '@components/Layout';
import { AuthContext, AuthType } from '@contexts/authContext';
import GlobalStyles from '@styles/globalStyles';
import theme from '@styles/theme';

const notoSansKR = Noto_Sans_KR({
  weight: ['100', '300', '400', '500', '700', '900'],
});

const queryClient = new QueryClient();

interface AuthProviderProps {
  children: React.ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = useState<AuthType>({
    isLoggedIn: false,
    user: {
      id: '',
      username: '',
      avatarUrl: '',
    },
  });
  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
}

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Devrank</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <GlobalStyles />
            <div className={notoSansKR.className}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </div>
          </AuthProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default appWithTranslation(App);
