import { useTranslation } from 'next-i18next';
import { useQuery } from '@tanstack/react-query';
import { RankingResponse } from '@type/response';
import { RankingTable } from '@components/Ranking';
import { Avatar, CubeIcon } from '@components/common';
import { requestTopRankingByViews } from '@apis/ranking';

interface ViewsRankingProps {
  searchUser: (username: string) => void;
}

function ViewsRanking({ searchUser }: ViewsRankingProps) {
  const { data: rankingByViews } = useQuery<RankingResponse[]>(['top-ranking-by-views'], () =>
    requestTopRankingByViews(),
  );

  const { t } = useTranslation(['index', 'common']);

  return (
    <>
      <h3>{t('index:daily-views-top-3')}</h3>
      <RankingTable
        width={'512px'}
        columnWidthList={['10%', '11%', '59%', '20%']}
        columnAlignList={['right', 'center', 'left', 'right']}
      >
        <RankingTable.Head>
          <RankingTable.Element>{t('common:table-tier')}</RankingTable.Element>
          <RankingTable.Element>#</RankingTable.Element>
          <RankingTable.Element>{t('common:table-user')}</RankingTable.Element>
          <RankingTable.Element>{t('common:table-views')}</RankingTable.Element>
        </RankingTable.Head>
        {rankingByViews?.map(({ id, tier, username, avatarUrl, dailyViews }, idx) => (
          <RankingTable.Row key={id} onClick={() => searchUser(username)}>
            <RankingTable.Element>
              <CubeIcon tier={tier} />
            </RankingTable.Element>
            <RankingTable.Element>
              <span>{idx + 1}</span>
            </RankingTable.Element>
            <RankingTable.Element>
              <Avatar src={avatarUrl} name={username} />
            </RankingTable.Element>
            <RankingTable.Element>
              <span>{dailyViews.toLocaleString()}</span>
            </RankingTable.Element>
          </RankingTable.Row>
        ))}
      </RankingTable>
    </>
  );
}

export default ViewsRanking;
