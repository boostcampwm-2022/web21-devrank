import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@components/common';
import { requestGithubLogin } from '@apis/auth';

function Callback() {
  const router = useRouter();

  useQuery(['user'], () => requestGithubLogin(router.query.code as string), {
    cacheTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!router.query.code,
    select: (data) => data.user,
    onSuccess: () => {
      router.push('/');
    },
  });

  return (
    <Container>
      <Spinner width={60} height={60} />
    </Container>
  );
}

export default Callback;

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale as string, ['common', 'footer', 'header'])),
    },
  };
};

const Container = styled.div`
  ${({ theme }) => theme.common.flexCenter};
  background-color: ${({ theme }) => theme.colors.black1};
  width: 100%;
  height: 100%;

  position: fixed;
  top: 0;
  left: 0;

  z-index: 10;
`;
