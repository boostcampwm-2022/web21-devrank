import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import styled from 'styled-components';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { CubeRankType } from '@type/common';
import Filterbar from '@components/Filterbar';
import Ranking from '@components/Ranking';
import { Avatar, CubeIcon, LanguageIcon, Searchbar } from '@components/common';
import { requestTokenRefresh } from '@apis/auth';
import { CUBE_RANK } from '@utils/constants';
import { mockRanking } from '@utils/mockData';

function ranking() {
  const { t } = useTranslation(['ranking', 'common']);
  const [active, setActive] = useState<CubeRankType>(CUBE_RANK.ALL);

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
      <Ranking
        width={'100%'}
        columnWidthList={['8%', '52%', '10%', '10%', '20%']}
        columnAlignList={['center', 'left', 'left', 'left', 'center']}
      >
        <Ranking.Head>
          <Ranking.Element>#</Ranking.Element>
          <Ranking.Element>{t('common:table-user')}</Ranking.Element>
          <Ranking.Element>{t('common:table-tier')}</Ranking.Element>
          <Ranking.Element>{t('common:table-score')}</Ranking.Element>
          <Ranking.Element>{t('common:table-tech-stack')}</Ranking.Element>
        </Ranking.Head>
        {mockRanking.map((data) => (
          <Ranking.Row key={data.id}>
            <Ranking.Element>{data.id}</Ranking.Element>
            <Ranking.Element>
              <Avatar src={data.avatarUrl} name={data.username} />
            </Ranking.Element>
            <Ranking.Element>
              <CubeIcon tier={data.tier as CubeRankType} />
            </Ranking.Element>
            <Ranking.Element>{data.score}</Ranking.Element>
            <Ranking.Element>
              <TechStackList>
                {data.langs.map((lang) => (
                  <li key={lang}>
                    <LanguageIcon language={lang} width={35} height={35} />
                  </li>
                ))}
              </TechStackList>
            </Ranking.Element>
          </Ranking.Row>
        ))}
      </Ranking>
    </Container>
  );
}

export default ranking;

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
