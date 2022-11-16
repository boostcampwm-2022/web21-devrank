import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { LocaleProps } from '@types';

function Home() {
  return <div>home</div>;
}

export default Home;

export const getStaticProps = async ({ locale }: LocaleProps) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'footer', 'header'])),
    },
  };
};
