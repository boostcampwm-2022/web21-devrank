import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styled from 'styled-components';
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import { ProfileUserResponse } from '@type/response';
import { CommitHistory, EXPbar, PinnedRepository, ProfileCard } from '@components/Profile';
import { Paper } from '@components/common';
import { requestTokenRefresh } from '@apis/auth';
import { requestUserInfoByUsername } from '@apis/users';

interface ProfileProps {
  username: string;
}

function Profile({ username }: ProfileProps) {
  const { data, isFetching } = useQuery<ProfileUserResponse>(['profile', username], () =>
    requestUserInfoByUsername({ username }),
  );
  const { t } = useTranslation('profile');

  if (isFetching || !data) return;
  return (
    <Container>
      <ProfileCard
        profileData={{
          username,
          name: data.name,
          location: data.location,
          followers: data.followers,
          following: data.following,
          company: data.company,
          email: data.email,
          organizations: data.organizations,
          avatarUrl: data.avatarUrl,
          tier: data.tier,
          tierRank: data.tierRank,
          totalRank: data.totalRank,
        }}
      />
      <Title>EXP</Title>
      <EXPbar exp={data?.score} />
      <ContributionHeader>
        <Title>Contributions</Title>
        <p>{`${t('maximum-continuous-commit-history')} : ${data.history.maxContinuosCount}${t('day')}`}</p>
      </ContributionHeader>
      <Paper>
        <CommitHistory history={data.history} tier={data.tier} />
      </Paper>
      <Title>WakaTime</Title>
      <Paper></Paper>
      <Title>Github stats</Title>
      <Paper></Paper>
      <Title>Pinned Repositories</Title>
      <Paper>
        <PinnedRepository repositories={data.pinnedRepositories} />
      </Paper>
    </Container>
  );
}

export default Profile;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const username = context.query.username as string;

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery(['user'], () => requestTokenRefresh(context)),
    queryClient.prefetchQuery(['profile', username], () => requestUserInfoByUsername({ username })),
  ]);

  if (queryClient.getQueryData(['profile', username])) {
    return {
      props: {
        username,
        dehydratedState: dehydrate(queryClient),
        ...(await serverSideTranslations(context.locale as string, [
          'common',
          'header',
          'footer',
          'tier',
          'ranking',
          'profile',
        ])),
      },
    };
  } else {
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
  max-width: 1400px;
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
    margin: 80px 20px 10px;
  }
`;
