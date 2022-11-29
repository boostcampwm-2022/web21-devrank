import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styled from 'styled-components';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { EXPbar, PinnedRepository, ProfileCard } from '@components/Profile';
import { Paper } from '@components/common';
import { requestTokenRefresh } from '@apis/auth';
import { requestUserInfoByUsername } from '@apis/profile';

function Profile() {
  const repositoriesMock = [
    {
      name: '레파지토리 이름',
      description: '레파지토리 설명',
      languages: ['javascript', 'html', 'css'],
      stars: 100000,
      forks: 100,
    },
    {
      name: '레파지토리 이름2',
      description: '레파지토리 설명',
      languages: ['javascript', 'html', 'css'],
      stars: 100000,
      forks: 100,
    },
    {
      name: '레파지토리 이름 레파지토리 이름 레파지토리 이름 레파지토리 이름',
      description: '레파지토리 설명 레파지토리 설명 레파지토리 설명 레파지토리 설명 레파지토리 설명 레파지토리 설명',
      languages: ['javascript', 'html', 'css'],
      stars: 100000,
      forks: 100,
    },
    {
      name: '레파지토리 이름2 레파지토리 이름 레파지토리 이름 레파지토리 이름',
      description: '레파지토리3 설명 레파지토리 설명 레파지토리 설명 레파지토리 설명 레파지토리 설명 레파지토리 설명',
      languages: ['javascript', 'html', 'css'],
      stars: 100000,
      forks: 100,
    },
    {
      name: '레파지토리 이름 레파지토리 이름 레파지토리 이름 레파지토리 이33름',
      description: '레파지토리 설명 레파지토리 설명 레파지토리 설명 레33파지토리 설명 레파지토리 설명 레파지토리 설명',
      languages: ['javascript', 'html', 'css'],
      stars: 100000,
      forks: 100,
    },
    {
      name: '레파지토리 이름 레파지토리 이름 레파지토리 이33름 레파지토리 이름',
      description: '레파지토리 설명 레파지토리 설명 레파지토리 설명 레파지토리 설명 레파지토리 설명 레파지토리 설명',
      languages: ['javascript', 'html', 'css'],
      stars: 100000,
      forks: 100,
    },
  ];

  return (
    <Container>
      <ProfileCard />
      <Title>EXP</Title>
      <EXPbar exp={260} />
      <Title>Contributions</Title>
      <Paper></Paper>
      <Title>WakaTime</Title>
      <Paper></Paper>
      <Title>Github stats</Title>
      <Paper></Paper>
      <Title>Pinned Repositories</Title>
      <Paper>
        <PinnedRepository repositories={repositoriesMock} />
      </Paper>
    </Container>
  );
}

export default Profile;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const username = context.query.username as string;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['user'], () => requestTokenRefresh(context));

  try {
    await requestUserInfoByUsername({ username });
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        ...(await serverSideTranslations(context.locale as string, ['common', 'header', 'footer', 'tier', 'ranking'])),
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: '/profile/404',
        permanent: false,
      },
    };
  }
};

const Container = styled.div`
  ${({ theme }) => theme.common.flexColumn};
  max-width: 1600px;
  width: 100%;
  padding: 100px 50px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.xxl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  margin: 80px 0px 30px 10px;
`;
