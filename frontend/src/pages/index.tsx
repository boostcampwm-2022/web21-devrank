import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import LanguageRanking from '@components/Ranking/LanguageRanking';
import OverallRanking from '@components/Ranking/OverallRanking';
import RisingRanking from '@components/Ranking/RisingRanking';
import ViewsRanking from '@components/Ranking/ViewsRanking';
import CubeLogo from '@components/common/CubeLogo';
import HeadMeta from '@components/common/HeadMeta';
import AutoCompleteSearchbar from '@components/common/Searchbar/AutoComplete';
import { requestTokenRefresh } from '@apis/auth';
import {
  requestProgrammingLanguageRanking,
  requestTopRankingByRising,
  requestTopRankingByScore,
  requestTopRankingByViews,
} from '@apis/ranking';
import { ssrWrapper } from '@utils/wrapper';

function Home() {
  const { t } = useTranslation(['index', 'common', 'meta']);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const router = useRouter();

  const searchUser = (username: string) => {
    router.push(`/profile/${username}`);
  };

  return isSearchLoading ? (
    <Loading>
      <div>
        사용자 검색 중 입니다<span>.</span>
      </div>
    </Loading>
  ) : (
    <>
      <HeadMeta title={t('meta:main-title')} description={t('meta:main-description')} />
      <Container>
        <h2>
          <CubeLogo size='lg' tier='all' />
        </h2>
        <AutoCompleteSearchbar
          type='text'
          width={600}
          placeholder={t('index:search-placeholder')}
          submitAlign='right'
          onBeforeSearch={() => setIsSearchLoading(true)}
        />
        <Content>
          <OverallRankingSection>
            <OverallRanking searchUser={searchUser} />
          </OverallRankingSection>
          <RisingRankingSection>
            <RisingRanking searchUser={searchUser} />
          </RisingRankingSection>
          <ViewRankingSection>
            <ViewsRanking searchUser={searchUser} />
          </ViewRankingSection>
          <LanguageRankingSection>
            <LanguageRanking />
          </LanguageRankingSection>
        </Content>
      </Container>
    </>
  );
}

export default Home;

export const getServerSideProps: GetServerSideProps = ssrWrapper(
  ['index', 'common', 'header', 'footer', 'meta'],
  async (context, queryClient) => {
    await Promise.allSettled([
      queryClient.prefetchQuery(['top-ranking-by-score'], () =>
        requestTopRankingByScore({
          limit: 12,
        }),
      ),
      queryClient.prefetchQuery(['top-ranking-by-rising'], () => requestTopRankingByRising()),
      queryClient.prefetchQuery(['top-ranking-by-views'], () => requestTopRankingByViews()),
      queryClient.prefetchQuery(['top-ranking-by-programming-lang'], () => requestProgrammingLanguageRanking()),
      queryClient.prefetchQuery(['user'], () => requestTokenRefresh(context)),
    ]);
  },
);

const Container = styled.div`
  ${({ theme }) => theme.common.flexCenterColumn};
  padding: 100px 50px;
  margin: 0 auto;

  h2 {
    margin-bottom: 100px;
  }
`;

const loading = keyframes`
  0% {
    content: '';
  }

  33% {
    content: '.';
  }

  66% {
    content: '..';
  }
`;

const Loading = styled.div`
  ${({ theme }) => theme.common.flexCenter};
  font-size: ${({ theme }) => theme.fontSize.lg};
  background-color: ${({ theme }) => theme.colors.black1};
  width: 100%;
  height: 100%;

  position: fixed;
  top: 0;
  left: 0;

  z-index: 10;
  div {
    position: relative;

    span {
      position: absolute;
      right: -5px;

      &:after {
        content: '';
        position: absolute;
        animation: ${loading} 2s linear infinite;
      }
    }
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-areas:
    'a b'
    'a c'
    'a d';
  grid-gap: 16px;
  color: ${({ theme }) => theme.colors.gray6};
  margin-top: 50px;

  h3 {
    font-size: ${({ theme }) => theme.fontSize.xl};
    margin-bottom: 8px;
  }
`;

const OverallRankingSection = styled.section`
  grid-area: a;
`;

const RisingRankingSection = styled.section`
  grid-area: b;
`;

const ViewRankingSection = styled.section`
  grid-area: c;
`;

const LanguageRankingSection = styled.section`
  grid-area: d;
`;
