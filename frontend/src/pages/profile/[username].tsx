import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styled from 'styled-components';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { CommitHistory, EXPbar, PinnedRepository, ProfileCard } from '@components/Profile';
import { Paper } from '@components/common';
import { requestTokenRefresh } from '@apis/auth';

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
      <ContributionHeader>
        <Title>Contributions</Title>
        <p>최대 연속 커밋 일수 10일</p>
      </ContributionHeader>
      <Paper>
        <CommitHistory />
      </Paper>
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
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['user'], () => requestTokenRefresh(context));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...(await serverSideTranslations(context.locale as string, ['common', 'header', 'footer', 'tier', 'ranking'])),
    },
  };
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

const ContributionHeader = styled.div`
  ${({ theme }) => theme.common.flexSpaceBetween};

  p {
    font-size: ${({ theme }) => theme.fontSize.lg};
    font-weight: ${({ theme }) => theme.fontWeight.bold};
    margin: 80px 0px 30px;
  }
`;
