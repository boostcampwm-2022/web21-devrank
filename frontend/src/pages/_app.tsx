import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from 'styled-components';
import { Noto_Sans_KR } from '@next/font/google';
import Layout from '@components/Layout';
import GlobalStyles from '@styles/globalStyles';
import theme from '@styles/theme';
import { AuthContext } from '@contexts/authContext';

const notoSansKR = Noto_Sans_KR({
  weight: ['100', '300', '400', '500', '700', '900'],
});

function App({ Component, pageProps }: AppProps) {

  return (
    <>
      <Head>
        <title>Devrank</title>
      </Head>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <AuthContext.Provider value={false}>
          <div className={notoSansKR.className}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </div>
        </AuthContext.Provider>
      </ThemeProvider>
    </>
  );
}

export default appWithTranslation(App);
