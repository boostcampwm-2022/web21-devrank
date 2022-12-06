import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styled from 'styled-components';
import { QueryClient, dehydrate, useMutation, useQuery } from '@tanstack/react-query';
import { ProfileUserResponse } from '@type/response';
import { CommitHistory, EXPbar, PinnedRepository, ProfileCard } from '@components/Profile';
import { Paper } from '@components/common';
import { requestTokenRefresh } from '@apis/auth';
import { requestUserInfoByUsername } from '@apis/users';

interface ProfileProps {
  username: string;
}

function Profile({ username }: ProfileProps) {
  const MAX_COMMIT_STREAK = 368;
  const { data, refetch } = useQuery<ProfileUserResponse>(['profile', username], () =>
    requestUserInfoByUsername({ username, method: 'GET' }),
  );

  const { mutate, isLoading } = useMutation<ProfileUserResponse>({
    mutationFn: () => requestUserInfoByUsername({ username, method: 'PATCH' }),
    onError: () => alert('최근에 업데이트 했습니다.'),
    onSettled: () => refetch(),
  });

  const { t } = useTranslation('profile');

  return (
    <Container>
      {data && (
        <>
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
              updateDelayTime: data.updateDelayTime,
              updateData: mutate,
              isLoading,
            }}
          />
          <Title>EXP</Title>
          <EXPbar exp={data?.score} />
          <ContributionHeader>
            <Title>Contributions</Title>
            <p>{`${t('maximum-continuous-commit-history')} : ${data.history.maxContinuosCount}${
              data.history.maxContinuosCount >= MAX_COMMIT_STREAK ? `${t('day')}~` : t('day')
            }`}</p>
          </ContributionHeader>
          <Paper>
            <CommitHistory history={data.history} tier={data.tier} />
          </Paper>
          <Title>Github stats</Title>
          <Paper></Paper>
          <Title>Pinned Repositories</Title>
          <Paper>
            <PinnedRepository repositories={data.pinnedRepositories} />
          </Paper>
        </>
      )}
    </Container>
  );
}

export default Profile;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const username = context.query.username as string;

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery(['user'], () => requestTokenRefresh(context)),
    queryClient.prefetchQuery(['profile', username], () => requestUserInfoByUsername({ username, method: 'GET' })),
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
