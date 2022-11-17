import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { LocaleProps } from '@types';
import {GetStaticProps} from 'next'

function Home() {
  return <div>home</div>;
}

export default Home;

export const getStaticProps:GetStaticProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale as string, ['common', 'footer', 'header'])),
    },
  };
};