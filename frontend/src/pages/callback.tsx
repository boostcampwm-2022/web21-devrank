import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@components/common';
import { requestGithubLogin } from '@apis/auth';

function Callback() {
  const router = useRouter();

  useQuery(['user'], () => requestGithubLogin(router.query.code as string), {
    cacheTime: Infinity,
    enabled: !!router.query.code,
    onSuccess: () => {
      const loginPathname = localStorage.getItem('login-pathname');
      if (loginPathname) router.push(loginPathname);
      else router.push('/');
    },
    onError: (err) => {
      console.error(err);
      router.push('/');
    },
  });

  useEffect(() => {
    if (router.isReady && router.query.error) {
      const loginPathname = localStorage.getItem('login-pathname');
      if (loginPathname) router.push(loginPathname);
      else router.push('/');
    }
  }, [router]);

  return (
    <Container>
      <Spinner size={60} />
    </Container>
  );
}

export default Callback;

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
