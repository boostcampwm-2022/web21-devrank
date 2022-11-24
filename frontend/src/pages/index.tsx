import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import styled from 'styled-components';
import { useRefresh } from '@hooks';
import { useQuery } from '@tanstack/react-query';
import { RankingResponse } from '@type/response';
import Ranking from '@components/Ranking';
import { Avatar, LanguageIcon } from '@components/common';
import CubeIcon from '@components/common/CubeIcon';
import Searchbar from '@components/common/Searchbar';
import { requestTopRankingByRising, requestTopRankingByScore, requestTopRankingByViews } from '@apis/ranking';
import { mockLanguage } from '@utils/mockData';

function Home(props: any) {
  useRefresh();
  const { t } = useTranslation(['index', 'common']);
  const { data: rankingByScore } = useQuery<RankingResponse[]>(
    ['top-ranking-by-score'],
    () => requestTopRankingByScore(12),
    {
      initialData: props.topRankingByScore,
    },
  );
  const { data: rankingByRising } = useQuery<RankingResponse[]>(
    ['top-ranking-by-rising'],
    () => requestTopRankingByRising(),
    {
      initialData: props.topRankingByRising,
    },
  );
  const { data: rankingByViews } = useQuery<RankingResponse[]>(
    ['top-ranking-by-views'],
    () => requestTopRankingByViews(),
    {
      initialData: props.topRankingByViews,
    },
  );

  return (
    <Container>
      <h2>
        <Image src='/icons/logo-main.svg' alt='Devrank 로고' width={550} height={230} quality={100} priority />
      </h2>
      <Searchbar
        type='text'
        width={600}
        value=''
        placeholder={t('index:search-placeholder')}
        submitAlign='right'
        onChange={(e) => {
          console.log(e);
        }}
        onSubmit={(e) => {
          console.log(e);
        }}
      />
      <Content>
        <OverallRanking>
          <Title>{t('index:overall-ranking')}</Title>
          <Ranking
            width={'512px'}
            columnWidthList={['12%', '8%', '58%', '20%']}
            columnAlignList={['left', 'left', 'left', 'right']}
          >
            <Ranking.Head>
              <Ranking.Element>{t('common:table-tier')}</Ranking.Element>
              <Ranking.Element>#</Ranking.Element>
              <Ranking.Element>{t('common:table-user')}</Ranking.Element>
              <Ranking.Element>{t('common:table-score')}</Ranking.Element>
            </Ranking.Head>
            {rankingByScore?.map(({ id, tier, avatarUrl, username, score }, index) => (
              <Ranking.Row key={id}>
                <Ranking.Element>
                  <CubeIcon tier={tier} />
                </Ranking.Element>
                <Ranking.Element>
                  <GrayText>{index + 1}</GrayText>
                </Ranking.Element>
                <Ranking.Element>
                  <Avatar src={avatarUrl} name={username} />
                </Ranking.Element>
                <Ranking.Element>
                  <GrayText>{score.toLocaleString()}</GrayText>
                </Ranking.Element>
              </Ranking.Row>
            ))}
          </Ranking>
        </OverallRanking>
        <RisingRanking>
          <Title>{t('index:rising-user-top-3')}</Title>
          <Ranking
            width={'512px'}
            columnWidthList={['12%', '8%', '58%', '20%']}
            columnAlignList={['left', 'left', 'left', 'right']}
          >
            <Ranking.Head>
              <Ranking.Element>{t('common:table-tier')}</Ranking.Element>
              <Ranking.Element>#</Ranking.Element>
              <Ranking.Element>{t('common:table-user')}</Ranking.Element>
              <Ranking.Element>{t('common:table-score')}</Ranking.Element>
            </Ranking.Head>
            {rankingByRising?.map(({ id, tier, username, avatarUrl, score }, index) => (
              <Ranking.Row key={id}>
                <Ranking.Element>
                  <CubeIcon tier={tier} />
                </Ranking.Element>
                <Ranking.Element>
                  <GrayText>{index + 1}</GrayText>
                </Ranking.Element>
                <Ranking.Element>
                  <Avatar src={avatarUrl} name={username} />
                </Ranking.Element>
                <Ranking.Element>
                  <GrayText>{score.toLocaleString()}</GrayText>
                </Ranking.Element>
              </Ranking.Row>
            ))}
          </Ranking>
        </RisingRanking>
        <DailyRanking>
          <Title>{t('index:daily-views-top-3')}</Title>
          <Ranking
            width={'512px'}
            columnWidthList={['12%', '8%', '58%', '20%']}
            columnAlignList={['left', 'left', 'left', 'right']}
          >
            <Ranking.Head>
              <Ranking.Element>{t('common:table-tier')}</Ranking.Element>
              <Ranking.Element>#</Ranking.Element>
              <Ranking.Element>{t('common:table-user')}</Ranking.Element>
              <Ranking.Element>{t('common:table-views')}</Ranking.Element>
            </Ranking.Head>
            {rankingByViews?.map(({ id, tier, username, avatarUrl, dailyViews }, index) => (
              <Ranking.Row key={id}>
                <Ranking.Element>
                  <CubeIcon tier={tier} />
                </Ranking.Element>
                <Ranking.Element>
                  <GrayText>{index + 1}</GrayText>
                </Ranking.Element>
                <Ranking.Element>
                  <Avatar src={avatarUrl} name={username} />
                </Ranking.Element>
                <Ranking.Element>
                  <GrayText>{dailyViews.toLocaleString()}</GrayText>
                </Ranking.Element>
              </Ranking.Row>
            ))}
          </Ranking>
        </DailyRanking>
        <LanguageRanking>
          <Title>{t('index:most-programming-lang-top-3')}</Title>
          <Ranking width={'512px'} columnWidthList={['13%', '56%', '31%']} columnAlignList={['left', 'left', 'right']}>
            <Ranking.Head>
              <Ranking.Element>{t('common:table-programming-lang')}</Ranking.Element>
              <Ranking.Element />
              <Ranking.Element>{t('common:table-user-num')}</Ranking.Element>
            </Ranking.Head>
            {mockLanguage.map(({ language, count }) => (
              <Ranking.Row key={language}>
                <Ranking.Element>
                  <LanguageIcon language={language} width={30} height={30} />
                </Ranking.Element>
                <Ranking.Element>{language}</Ranking.Element>
                <Ranking.Element>
                  <GrayText>{count}</GrayText>
                </Ranking.Element>
              </Ranking.Row>
            ))}
          </Ranking>
        </LanguageRanking>
      </Content>
    </Container>
  );
}

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const [topRankingByScore, topRankingByRising, topRankingByViews] = await Promise.all([
    requestTopRankingByScore(12),
    requestTopRankingByRising(),
    requestTopRankingByViews(),
  ]);

  return {
    props: {
      topRankingByScore,
      topRankingByRising,
      topRankingByViews,
      ...(await serverSideTranslations(context.locale as string, ['index', 'common', 'header', 'footer'])),
    },
  };
};

const Container = styled.div`
  ${({ theme }) => theme.common.flexCenterColumn};
  padding: 100px 50px;
  margin: 0 auto;

  h2 {
    margin-bottom: 100px;
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-areas:
    'a b'
    'a c'
    'a d';
  grid-gap: 1.37rem;
  margin-top: 50px;
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.xl};
  margin-bottom: 0.5rem;
`;

const OverallRanking = styled.div`
  grid-area: a;
`;

const RisingRanking = styled.div`
  grid-area: b;
`;

const DailyRanking = styled.div`
  grid-area: c;
`;

const LanguageRanking = styled.div`
  grid-area: d;
`;

const GrayText = styled.span`
  color: ${({ theme }) => theme.colors.gray6};
`;
