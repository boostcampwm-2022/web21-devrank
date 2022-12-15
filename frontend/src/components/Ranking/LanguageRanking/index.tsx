import { useTranslation } from 'next-i18next';
import { useQuery } from '@tanstack/react-query';
import { ProgrammingLanguageRankingResponse } from '@type/response';
import { RankingTable } from '@components/Ranking';
import { LanguageIcon } from '@components/common';
import { requestProgrammingLanguageRanking } from '@apis/ranking';

function LanguageRanking() {
  const { data: rankingByProgrammingLang } = useQuery<ProgrammingLanguageRankingResponse[]>(
    ['top-ranking-by-programming-lang'],
    () => requestProgrammingLanguageRanking(),
  );

  const { t } = useTranslation(['index', 'common']);

  return (
    <>
      <h3>{t('index:most-programming-lang-top-3')}</h3>
      <RankingTable
        width={'512px'}
        columnWidthList={['15%', '55%', '30%']}
        columnAlignList={['center', 'left', 'right']}
      >
        <RankingTable.Head>
          <RankingTable.Element>{t('common:table-programming-lang')}</RankingTable.Element>
          <RankingTable.Element />
          <RankingTable.Element>{t('common:table-user-num')}</RankingTable.Element>
        </RankingTable.Head>
        <RankingTable.Body>
          {rankingByProgrammingLang?.map(({ language, count }) => (
            <RankingTable.Row key={language}>
              <RankingTable.Element>
                <LanguageIcon language={language} width={30} height={30} />
              </RankingTable.Element>
              <RankingTable.Element>{language}</RankingTable.Element>
              <RankingTable.Element>
                <span>{count}</span>
              </RankingTable.Element>
            </RankingTable.Row>
          ))}
        </RankingTable.Body>
      </RankingTable>
    </>
  );
}

export default LanguageRanking;
