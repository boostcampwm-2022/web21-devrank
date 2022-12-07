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
        columnWidthList={['12%', '12%', '56%', '20%']}
        columnAlignList={['left', 'left', 'left', 'right']}
      >
        <RankingTable.Head>
          <RankingTable.Element>{t('common:table-tier')}</RankingTable.Element>
          <RankingTable.Element>#</RankingTable.Element>
          <RankingTable.Element>{t('common:table-user')}</RankingTable.Element>
          <RankingTable.Element>{t('common:table-score')}</RankingTable.Element>
        </RankingTable.Head>
        {rankingByRising?.map(({ id, tier, username, avatarUrl, score, scoreDifference }) => (
          <RankingTable.Row key={id} onClick={() => searchUser(username)}>
            <RankingTable.Element>
              <CubeIcon tier={tier} />
            </RankingTable.Element>
            <RankingTable.Element>
              <Change>
                {scoreDifference > 0 ? (
                  <>
                    <Image src='/icons/arrow-up.svg' width={16} height={16} alt='down' className='up' />
                    {numberCompactFormatter(scoreDifference)}
                  </>
                ) : (
                  <Image src='/icons/arrow-bar.svg' width={10} height={10} alt='down' className='zero' />
                )}
              </Change>
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

const Change = styled.span`
  display: flex;
  gap: 1px;
  font-size: 16px;
  .up {
    margin-top: 3px;
  }

  .zero {
    margin-left: 10px;
  }
`;
