import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Spinner } from '@components/common';
import { AuthContext } from '@contexts/authContext';
import { requestGithubLogin } from '@apis/auth';

function Callback() {
  const router = useRouter();
  const { setAuth } = useContext(AuthContext);

  useEffect(() => {
    if (!router.isReady) return;
    const code = router.query.code as string;

    (async function () {
      try {
        const response = await requestGithubLogin(code);
        router.push('/');
        setAuth({
          isLoggedIn: true,
        });
      } catch (err) {
        console.error(err);
      }
    })();
  }, [router.isReady]);

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
