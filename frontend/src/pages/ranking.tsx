import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import styled from 'styled-components';
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import { CubeRankType } from '@type/common';
import { RankingResponse } from '@type/response';
import Filterbar from '@components/Filterbar';
import RankingTable from '@components/Ranking';
import NotFound from '@components/Ranking/NotFound';
import { Avatar, CubeIcon, LanguageIcon, RankingSkeleton, Searchbar } from '@components/common';
import { requestTokenRefresh } from '@apis/auth';
import { requestTopRankingByScore } from '@apis/ranking';
import { COUNT_PER_PAGE, CUBE_RANK } from '@utils/constants';

function Ranking() {
  const { t } = useTranslation(['ranking', 'common']);
  const [tier, setTier] = useState<CubeRankType>(CUBE_RANK.ALL);
  const [username, setUsername] = useState('');

  const { isLoading, data } = useQuery<RankingResponse[]>(['ranking', tier, username], () =>
    requestTopRankingByScore({ limit: COUNT_PER_PAGE, tier, username }),
  );

  const setFilter = (tier: CubeRankType) => {
    setTier(tier);
    setUsername('');
  };

  const onSearch = (input: string) => {
    setUsername(input);
  };

  return (
    <Container>
      <Filterbar active={tier} setActive={setFilter} />
      <SearchbarContainer>
        {username !== '' && <SearchInfo>&apos;{username}&apos;에 대한 검색 결과 입니다.</SearchInfo>}
        <Searchbar
          type='text'
          placeholder={t('ranking:search-placeholder')}
          width={200}
          submitAlign='left'
          onSearch={onSearch}
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
      {isLoading && Array.from({ length: COUNT_PER_PAGE }).map((_, index) => <RankingSkeleton key={index} />)}
      {data?.length === 0 && <NotFound />}
    </Container>
  );
}

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
  await queryClient.prefetchQuery(['ranking', CUBE_RANK.ALL, ''], () => requestTopRankingByScore({ limit: 10 }));

  return {
    props: {
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
  position: relative;
  ${({ theme }) => theme.common.flexRow};
  justify-content: flex-end;
  width: 100%;
  margin: 30px 0px 10px;
`;

const SearchInfo = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
`;

const TechStackList = styled.ul`
  ${({ theme }) => theme.common.flexCenter};

  li + li {
    margin-left: 8px;
  }
`;
