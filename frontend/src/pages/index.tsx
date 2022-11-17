import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import styled from 'styled-components';
import { useRefresh } from '@hooks';
import Searchbar from '@components/common/Searchbar';

function Home() {
  useRefresh();

  return (
    <Container>
      <h2>
        <Image src='/icons/logo-main.svg' alt='Devrank 로고' width={550} height={230} quality={100} />
      </h2>
      <Searchbar
        type='text'
        width={600}
        value=''
        placeholder='유저를 검색해주세요'
        submitAlign='right'
        onChange={(e) => {}}
        onSubmit={(e) => {}}
      />
    </Container>
  );
}

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale as string, ['common', 'footer', 'header'])),
    },
  };
};

const Container = styled.div`
  ${({ theme }) => theme.common.flexCenterColumn};
  padding: 100px 50px;

  h2 {
    margin-bottom: 100px;
  }
`;
