import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { CubeRankType } from '@type/common';
import { RankingPaginationResponse } from '@type/response';
import Filterbar from '@components/Filterbar';
import Pagination from '@components/Pagination';
import { NotFound, RankingSearchbar, RankingTable } from '@components/Ranking';
import { Avatar, CubeIcon, HeadMeta, LanguageIcon, RankingSkeleton } from '@components/common';
import { requestTokenRefresh } from '@apis/auth';
import { requestTopRankingByScore } from '@apis/ranking';
import { COUNT_PER_PAGE, CUBE_RANK } from '@utils/constants';
import { queryValidator } from '@utils/utils';
import { ssrWrapper } from '@utils/wrapper';

interface RankingProps {
  tier: string;
  username: string;
  page: number;
}

function Ranking({ tier, username, page }: RankingProps) {
  const router = useRouter();
  const { t } = useTranslation(['ranking', 'common', 'meta']);

  const { isLoading, isError, data } = useQuery<RankingPaginationResponse>(['ranking', tier, username, page], () =>
    requestTopRankingByScore({ limit: COUNT_PER_PAGE, tier, username, page }),
  );

  const searchUser = (username: string) => {
    router.push(`/profile/${username}`);
  };

  const setFiltering = (tier?: string, page?: number, username?: string) => {
    router.push(`/ranking?tier=${tier}&page=${page}${username ? `&username=${username}` : ''}`);
  };

  const setUsername = (username: string) => {
    setFiltering(tier, 1, username);
  };

  const setTier = (tier: CubeRankType) => {
    setFiltering(tier, 1);
  };

  const setPage = (page: number) => {
    setFiltering(tier, page, username);
  };

  return (
    <>
      <HeadMeta title={t('meta:ranking-title')} description={t('meta:ranking-description')} />
      <Container>
        <Filterbar active={tier} setActive={setTier} />
        <SearchbarContainer>
          {username !== '' && <SearchInfo>{t('ranking:search-user', { username })}</SearchInfo>}
          <RankingSearchbar placeholder={t('ranking:search-placeholder')} width={200} onSearch={setUsername} />
        </SearchbarContainer>
        <RankingTable
          width={'100%'}
          columnWidthList={['10%', '50%', '10%', '10%', '20%']}
          columnAlignList={['center', 'left', 'left', 'left', 'center']}
        >
          <RankingTable.Head>
            <RankingTable.Element>#</RankingTable.Element>
            <RankingTable.Element>{t('common:table-user')}</RankingTable.Element>
            <RankingTable.Element>{t('common:table-tier')}</RankingTable.Element>
            <RankingTable.Element>{t('common:table-score')}</RankingTable.Element>
            <RankingTable.Element>{t('common:table-tech-stack')}</RankingTable.Element>
          </RankingTable.Head>
          <RankingTable.Body>
            {data?.users.map(
              ({ id, username, avatarUrl, tier: eachTier, score, primaryLanguages, totalRank, tierRank }) => (
                <RankingTable.Row key={id} onClick={() => searchUser(username)}>
                  <RankingTable.Element>
                    <GrayText>{tier === 'all' ? totalRank : tierRank}</GrayText>
                  </RankingTable.Element>
                  <RankingTable.Element>
                    <Avatar src={avatarUrl} name={username} />
                  </RankingTable.Element>
                  <RankingTable.Element>
                    <CubeIcon tier={eachTier} />
                  </RankingTable.Element>
                  <RankingTable.Element>
                    <GrayText>{score?.toLocaleString()}</GrayText>
                  </RankingTable.Element>
                  <RankingTable.Element>
                    <TechStackList>
                      {primaryLanguages.map((lang) => (
                        <li key={lang}>
                          <LanguageIcon language={lang} width={35} height={35} />
                        </li>
                      ))}
                    </TechStackList>
                  </RankingTable.Element>
                </RankingTable.Row>
              ),
            )}
          </RankingTable.Body>
        </RankingTable>
        {isLoading && Array.from({ length: COUNT_PER_PAGE }).map((_, index) => <RankingSkeleton key={index} />)}
        {isError && <NotFound />}
        {data?.metadata && (
          <PaginationContainer>
            <Pagination
              currentPage={page}
              range={data.metadata.range}
              firstPage={data.metadata.firstPage}
              lastPage={data.metadata.lastPage}
              canMoveLeft={data.metadata.left}
              canMoveRight={data.metadata.right}
              setCurrentPage={setPage}
            />
          </PaginationContainer>
        )}
      </Container>
    </>
  );
}

export default Ranking;

export const getServerSideProps: GetServerSideProps = ssrWrapper(
  ['common', 'header', 'footer', 'tier', 'ranking', 'meta'],
  async (context, queryClient) => {
    const { tier, username, page } = context.query;
    const query = queryValidator({ tier, username, page });

    await Promise.allSettled([
      queryClient.prefetchQuery(['user'], () => requestTokenRefresh(context)),
      queryClient.prefetchQuery(['ranking', CUBE_RANK.ALL], () => requestTopRankingByScore({ limit: COUNT_PER_PAGE })),
    ]);

    if (!query) {
      throw { url: '/404' };
    }

    return query;
  },
);

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

const GrayText = styled.span`
  color: ${({ theme }) => theme.colors.gray6};
`;

const PaginationContainer = styled.div`
  margin-top: 40px;
`;
