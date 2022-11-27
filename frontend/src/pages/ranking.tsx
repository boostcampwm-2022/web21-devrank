import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { CubeRankType } from '@type/common';
import { RankingResponse } from '@type/response';
import Filterbar from '@components/Filterbar';
import RankingTable from '@components/Ranking';
import { Avatar, CubeIcon, LanguageIcon, Searchbar } from '@components/common';
import { requestTokenRefresh } from '@apis/auth';
import { requestTopRankingByScore } from '@apis/ranking';
import { CUBE_RANK } from '@utils/constants';

interface RankingPageProps {
  ranking: RankingResponse[];
}

const Ranking: NextPage<RankingPageProps> = ({ ranking }) => {
  const { t } = useTranslation(['ranking', 'common']);
  const [active, setActive] = useState<CubeRankType>(CUBE_RANK.ALL);
  const { data, refetch } = useQuery<RankingResponse[]>(
    ['ranking'],
    () => requestTopRankingByScore({ limit: 10, tier: active }),
    {
      initialData: ranking,
      keepPreviousData: true,
    },
  );

  useEffect(() => {
    refetch();
  }, [active]);

  return (
    <Container>
      <Filterbar active={active} setActive={setActive} />
      <SearchbarContainer>
        <Searchbar
          type='text'
          value=''
          placeholder={t('ranking:search-placeholder')}
          width={200}
          submitAlign='left'
          onChange={(e) => {}}
          onSubmit={(e) => {}}
        />
      </SearchbarContainer>
      <RankingTable
        width={'100%'}
        columnWidthList={['8%', '52%', '10%', '10%', '20%']}
        columnAlignList={['center', 'left', 'left', 'left', 'center']}
      >
        <RankingTable.Head>
          <RankingTable.Element>#</RankingTable.Element>
          <RankingTable.Element>{t('common:table-user')}</RankingTable.Element>
          <RankingTable.Element>{t('common:table-tier')}</RankingTable.Element>
          <RankingTable.Element>{t('common:table-score')}</RankingTable.Element>
          <RankingTable.Element>{t('common:table-tech-stack')}</RankingTable.Element>
        </RankingTable.Head>
        {data?.map(({ id, username, avatarUrl, tier, score }, index) => (
          <RankingTable.Row key={id}>
            <RankingTable.Element>{index + 1}</RankingTable.Element>
            <RankingTable.Element>
              <Avatar src={avatarUrl} name={username} />
            </RankingTable.Element>
            <RankingTable.Element>
              <CubeIcon tier={tier} />
            </RankingTable.Element>
            <RankingTable.Element>{score}</RankingTable.Element>
            <RankingTable.Element>
              {/* TODO: 기술스택 아이콘으로 변경
              <TechStackList>
                {data.langs.map((lang) => (
                  <li key={lang}>
                    <LanguageIcon language={lang} width={35} height={35} />
                  </li>
                ))}
              </TechStackList> */}
            </RankingTable.Element>
          </RankingTable.Row>
        ))}
      </RankingTable>
    </Container>
  );
};

export default Ranking;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
      },
    },
  });
  await queryClient.prefetchQuery(['user'], () => requestTokenRefresh(context));
  const ranking = await requestTopRankingByScore({
    limit: 10,
  });
  
  return {
    props: {
      ranking,
      dehydratedState: dehydrate(queryClient),
      ...(await serverSideTranslations(context.locale as string, ['common', 'header', 'footer', 'tier', 'ranking'])),
    },
  };
};

const Container = styled.div`
  ${({ theme }) => theme.common.flexCenterColumn};
  padding: 100px 50px;
  margin: 0 auto;
`;

const SearchbarContainer = styled.div`
  ${({ theme }) => theme.common.flexRow};
  justify-content: flex-end;
  width: 100%;
  margin: 30px 0px 10px;
`;

const TechStackList = styled.ul`
  ${({ theme }) => theme.common.flexCenter};

  li + li {
    margin-left: 8px;
  }
`;
