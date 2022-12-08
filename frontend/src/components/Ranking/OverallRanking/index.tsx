import { useTranslation } from 'next-i18next';
import { useQuery } from '@tanstack/react-query';
import { RankingPaginationResponse } from '@type/response';
import { RankingTable } from '@components/Ranking';
import { Avatar, CubeIcon } from '@components/common';
import { requestTopRankingByScore } from '@apis/ranking';
import { MAIN_PAGE_RANK_COUNT } from '@utils/constants';

interface OverallRankingProps {
  searchUser: (username: string) => void;
}

function OverallRanking({ searchUser }: OverallRankingProps) {
  const { data: rankingByScore } = useQuery<RankingPaginationResponse>(['top-ranking-by-score'], () =>
    requestTopRankingByScore({
      limit: MAIN_PAGE_RANK_COUNT,
    }),
  );

  const { t } = useTranslation(['ranking', 'common']);

  return (
    <>
      <h3>{t('index:overall-ranking')}</h3>
      <RankingTable
        width={'512px'}
        columnWidthList={['10%', '11%', '59%', '20%']}
        columnAlignList={['right', 'center', 'left', 'right']}
      >
        <RankingTable.Head>
          <RankingTable.Element>{t('common:table-tier')}</RankingTable.Element>
          <RankingTable.Element>#</RankingTable.Element>
          <RankingTable.Element>{t('common:table-user')}</RankingTable.Element>
          <RankingTable.Element>{t('common:table-score')}</RankingTable.Element>
        </RankingTable.Head>
        {rankingByScore?.users.map(({ id, tier, avatarUrl, username, score }, index) => (
          <RankingTable.Row key={id} onClick={() => searchUser(username)}>
            <RankingTable.Element>
              <CubeIcon tier={tier} />
            </RankingTable.Element>
            <RankingTable.Element>
              <span>{index + 1}</span>
            </RankingTable.Element>
            <RankingTable.Element>
              <Avatar src={avatarUrl} name={username} />
            </RankingTable.Element>
            <RankingTable.Element>
              <span>{score.toLocaleString()}</span>
            </RankingTable.Element>
          </RankingTable.Row>
        ))}
      </RankingTable>
    </>
  );
}

export default OverallRanking;
