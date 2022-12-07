import { useTranslation } from 'next-i18next';
import { useQuery } from '@tanstack/react-query';
import { RankingResponse } from '@type/response';
import { RankingTable } from '@components/Ranking';
import { Avatar, CubeIcon } from '@components/common';
import { requestTopRankingByRising } from '@apis/ranking';

interface RisingRankingProps {
  searchUser: (username: string) => void;
}

function RisingRanking({ searchUser }: RisingRankingProps) {
  const { data: rankingByRising } = useQuery<RankingResponse[]>(['top-ranking-by-rising'], () =>
    requestTopRankingByRising(),
  );

  const { t } = useTranslation(['index', 'common']);

  return (
    <>
      <h3>{t('index:rising-user-top-3')}</h3>
      <RankingTable
        width={'512px'}
        columnWidthList={['12%', '8%', '58%', '20%']}
        columnAlignList={['left', 'left', 'left', 'right']}
      >
        <RankingTable.Head>
          <RankingTable.Element>{t('common:table-tier')}</RankingTable.Element>
          <RankingTable.Element>#</RankingTable.Element>
          <RankingTable.Element>{t('common:table-user')}</RankingTable.Element>
          <RankingTable.Element>{t('common:table-score')}</RankingTable.Element>
        </RankingTable.Head>
        {rankingByRising?.map(({ id, tier, username, avatarUrl, score }, index) => (
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

export default RisingRanking;
