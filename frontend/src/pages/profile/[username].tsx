import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import styled from 'styled-components';
import { useQueryData } from '@hooks';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ProfileUserResponse } from '@type/response';
import { CommitHistory, EXPbar, PinnedRepository, ProfileCard, Statistic } from '@components/Profile';
import { Paper } from '@components/common';
import HeadMeta from '@components/common/HeadMeta';
import { requestTokenRefresh } from '@apis/auth';
import { requestUserInfoByUsername } from '@apis/users';
import { getProfileDescription } from '@utils/utils';
import { ssrWrapper } from '@utils/wrapper';

interface ProfileProps {
  username: string;
}

function Profile({ username }: ProfileProps) {
  const MAX_COMMIT_STREAK = 368;

  const { data, refetch } = useQuery<ProfileUserResponse>(['profile', username], () =>
    requestUserInfoByUsername({ username, method: 'GET' }),
  );

  const { queryData: userData } = useQueryData(['user']);

  const { mutate, isLoading } = useMutation<ProfileUserResponse>({
    mutationFn: () => requestUserInfoByUsername({ username, method: 'PATCH' }),
    onError: (err) => updateErrorHandler(err),
    onSettled: () => refetch(),
  });

  const { t } = useTranslation(['profile', 'meta']);
  const updateErrorHandler = (err: unknown) => {
    if (err instanceof AxiosError && err.response) {
      if (err.response.status >= 500) {
        alert('정보를 불러올 수 없는 유저입니다.');
      } else if (err.response.status >= 400) {
        alert('최근에 업데이트 했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  };

  useEffect(() => {
    requestTokenRefresh();
  }, []);

  return (
    <Container>
      {data && (
        <>
          <HeadMeta
            title={t('meta:profile-title', { username })}
            image={`https://dreamdev.me/api/og-image/?username=${username}&tier=${data.tier}&image=${data.avatarUrl}`}
            description={getProfileDescription(data)}
          />
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
              isMine: userData?.username === username,
              isInvalid: !data.history,
            }}
          />
          {data.history ? (
            <>
              <Title>EXP</Title>
              <EXPbar tier={data.tier} exp={data.score} needExp={data.needExp} startExp={data.startExp} />
              <ContributionHeader>
                <Title>Contributions</Title>
                <p>{`${t('maximum-continuous-commit-history')} : ${data.history.maxContinuousCount}${
                  data.history.maxContinuousCount >= MAX_COMMIT_STREAK ? `${t('day')}~` : t('day')
                }`}</p>
              </ContributionHeader>
              <Paper>
                <CommitHistory history={data.history} tier={data.tier} />
              </Paper>
              <Title>Stats</Title>
              <Paper>
                <Statistic history={data.history} scoreHistory={data.scoreHistory} tier={data.tier} />
              </Paper>
              <Title>Pinned Repositories</Title>
              <Paper>
                <PinnedRepository repositories={data.pinnedRepositories} />
              </Paper>
            </>
          ) : (
            <Alert>
              <div>
                <CubeImage
                  src='/icons/cube/cube-small-invalid.svg'
                  alt='큐브 이미지'
                  width={250}
                  height={240}
                  quality={100}
                  priority
                />
              </div>
              <strong>Invalid User</strong>
              <p>{t('profile:invalid-user')}</p>
            </Alert>
          )}
        </>
      )}
    </Container>
  );
}

export default Profile;

export const getServerSideProps: GetServerSideProps = ssrWrapper(
  ['common', 'header', 'footer', 'tier', 'ranking', 'profile', 'meta'],
  async (context, queryClient) => {
    const username = context.query.username as string;

    await Promise.allSettled([
      queryClient.prefetchQuery(['user'], () => requestTokenRefresh(context)),
      queryClient.prefetchQuery(['profile', username], () => requestUserInfoByUsername({ username, method: 'GET' })),
    ]);

    if (!queryClient.getQueryData(['profile', username])) {
      throw { url: '/profile/404' };
    }

    return { username };
  },
);

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

const Alert = styled.div`
  ${({ theme }) => theme.common.flexCenterColumn};
  width: 100%;
  background-color: ${({ theme }) => theme.colors.black4};
  margin-top: 60px;
  position: relative;
  height: 600px;

  div {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  strong {
    z-index: 1;
    font-size: 50px;
    margin-bottom: 44px;
  }

  p {
    z-index: 1;
    font-size: 28px;
  }
`;

const CubeImage = styled(Image)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
