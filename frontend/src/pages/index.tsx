import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRefresh } from '@hooks';

function Home() {
  useRefresh();

  return <div>home</div>;
}

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale as string, ['common', 'footer', 'header'])),
    },
  };
};
