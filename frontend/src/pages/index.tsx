import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import LanguageRanking from '@components/Ranking/LanguageRanking';
import OverallRanking from '@components/Ranking/OverallRanking';
import RisingRanking from '@components/Ranking/RisingRanking';
import ViewsRanking from '@components/Ranking/ViewsRanking';
import HeadMeta from '@components/common/HeadMeta';
import AutoCompleteSearchbar from '@components/common/Searchbar/AutoComplete';
import { requestTokenRefresh } from '@apis/auth';
import {
  requestProgrammingLanguageRanking,
  requestTopRankingByRising,
  requestTopRankingByScore,
  requestTopRankingByViews,
} from '@apis/ranking';

function Home() {
  const { t } = useTranslation(['index', 'common', 'meta']);
  const router = useRouter();

  const searchUser = (username: string) => {
    router.push(`/profile/${username}`);
  };

  return (
    <>
      <HeadMeta title={t('meta:main-title')} description={t('meta:main-description')} />
      <Container>
        <h2>
          <Image src='/icons/logo-main.svg' alt='Devrank 로고' width={550} height={230} quality={100} priority />
        </h2>
        <AutoCompleteSearchbar
          type='text'
          width={600}
          placeholder={t('index:search-placeholder')}
          submitAlign='right'
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();

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

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      ...(await serverSideTranslations(context.locale as string, ['index', 'common', 'header', 'footer', 'meta'])),
    },
  };
};

const Container = styled.div`
  ${({ theme }) => theme.common.flexCenterColumn};
  padding: 100px 50px;
  margin: 0 auto;

  h2 {
    margin-bottom: 100px;
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
