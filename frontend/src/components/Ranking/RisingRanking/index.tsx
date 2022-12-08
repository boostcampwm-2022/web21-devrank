import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { RankingResponse } from '@type/response';
import { RankingTable } from '@components/Ranking';
import { Avatar, CubeIcon } from '@components/common';
import { requestTopRankingByRising } from '@apis/ranking';
import { numberCompactFormatter } from '@utils/utils';

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
        columnWidthList={['10%', '11%', '59%', '20%']}
        columnAlignList={['right', 'center', 'left', 'right']}
      >
        <RankingTable.Head>
          <RankingTable.Element>{t('common:table-tier')}</RankingTable.Element>
          <RankingTable.Element>#</RankingTable.Element>
          <RankingTable.Element>{t('common:table-user')}</RankingTable.Element>
          <RankingTable.Element>{t('common:table-score')}</RankingTable.Element>
        </RankingTable.Head>
        {rankingByRising?.map(({ id, tier, username, avatarUrl, scoreDifference }, idx) => (
          <RankingTable.Row key={id} onClick={() => searchUser(username)}>
            <RankingTable.Element>
              <CubeIcon tier={tier} />
            </RankingTable.Element>
            <RankingTable.Element>{idx + 1}</RankingTable.Element>
            <RankingTable.Element>
              <Avatar src={avatarUrl} name={username} />
            </RankingTable.Element>
            <RankingTable.Element>
              {scoreDifference > 0 ? (
                <Change>
                  <Image src='/icons/arrow-up.svg' width={16} height={16} alt='down' />
                  <span>{numberCompactFormatter(scoreDifference)}</span>
                </Change>
              ) : (
                <NotChange src='/icons/arrow-bar.svg' width={10} height={10} alt='not change' />
              )}
            </RankingTable.Element>
          </RankingTable.Row>
        ))}
      </RankingTable>
    </>
  );
}

export default RisingRanking;

const NotChange = styled(Image)`
  margin-right: 8px;
`;

const Change = styled.div`
  display: flex;
  width: max-content;
  img {
    margin-top: 5px;
  }
`;
