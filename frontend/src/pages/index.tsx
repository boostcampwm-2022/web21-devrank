import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styled from 'styled-components';
import { useRefresh } from '@hooks';
import Ranking from '@components/Ranking';
import { Avatar, LanguageIcon } from '@components/common';
import CubeIcon from '@components/common/CubeIcon';
import { mockDaily, mockLanguage, mockOverall, mockRising } from '@utils/mockData';

function Home() {
  useRefresh();

  const { t } = useTranslation('index');

  return (
    <Container>
      <Content>
        <OverallRanking>
          <Title>{t('index:overall-ranking')}</Title>
          <Ranking
            width={512}
            columnWidthList={['12%', '8%', '58%', '20%']}
            columnAlignList={['left', 'left', 'left', 'right']}
          >
            <Ranking.Head>
              <Ranking.Element>티어</Ranking.Element>
              <Ranking.Element>#</Ranking.Element>
              <Ranking.Element>사용자</Ranking.Element>
              <Ranking.Element>점수</Ranking.Element>
            </Ranking.Head>
            {mockOverall.map(({ tier, user, score }, index) => (
              <Ranking.Row key={user.id}>
                <Ranking.Element>
                  <CubeIcon tier={tier} />
                </Ranking.Element>
                <Ranking.Element>
                  <GrayText>{index + 1}</GrayText>
                </Ranking.Element>
                <Ranking.Element>
                  <Avatar src='/profile-dummy.png' name={user.username} />
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
            width={512}
            columnWidthList={['12%', '8%', '58%', '20%']}
            columnAlignList={['left', 'left', 'left', 'right']}
          >
            <Ranking.Head>
              <Ranking.Element>티어</Ranking.Element>
              <Ranking.Element>#</Ranking.Element>
              <Ranking.Element>사용자</Ranking.Element>
              <Ranking.Element>점수</Ranking.Element>
            </Ranking.Head>
            {mockRising.map(({ tier, user, score }, index) => (
              <Ranking.Row key={user.id}>
                <Ranking.Element>
                  <CubeIcon tier={tier} />
                </Ranking.Element>
                <Ranking.Element>
                  <GrayText>{index + 1}</GrayText>
                </Ranking.Element>
                <Ranking.Element>
                  <Avatar src='/profile-dummy.png' name={user.username} />
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
            width={512}
            columnWidthList={['12%', '8%', '58%', '20%']}
            columnAlignList={['left', 'left', 'left', 'right']}
          >
            <Ranking.Head>
              <Ranking.Element>티어</Ranking.Element>
              <Ranking.Element>#</Ranking.Element>
              <Ranking.Element>사용자</Ranking.Element>
              <Ranking.Element>조회수</Ranking.Element>
            </Ranking.Head>
            {mockDaily.map(({ tier, user, view }, index) => (
              <Ranking.Row key={user.id}>
                <Ranking.Element>
                  <CubeIcon tier={tier} />
                </Ranking.Element>
                <Ranking.Element>
                  <GrayText>{index + 1}</GrayText>
                </Ranking.Element>
                <Ranking.Element>
                  <Avatar src='/profile-dummy.png' name={user.username} />
                </Ranking.Element>
                <Ranking.Element>
                  <GrayText>{view.toLocaleString()}회</GrayText>
                </Ranking.Element>
              </Ranking.Row>
            ))}
          </Ranking>
        </DailyRanking>
        <LanguageRanking>
          <Title>{t('index:most-programming-lang-top-3')}</Title>
          <Ranking width={512} columnWidthList={['13%', '56%', '31%']} columnAlignList={['left', 'left', 'right']}>
            <Ranking.Head>
              <Ranking.Element>언어</Ranking.Element>
              <Ranking.Element />
              <Ranking.Element>사용자수</Ranking.Element>
            </Ranking.Head>
            {mockLanguage.map(({ language, count }) => (
              <Ranking.Row key={language}>
                <Ranking.Element>
                  <LanguageIcon language={language} width={30} height={30} />
                </Ranking.Element>
                <Ranking.Element>{language}</Ranking.Element>
                <Ranking.Element>
                  <GrayText>{count}명</GrayText>
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

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale as string, ['index', 'common', 'header', 'footer'])),
    },
  };
};

const Container = styled.div`
  width: 1080px;
`;

const Content = styled.div`
  width: 100%;
  display: grid;
  grid-template-areas:
    'a b'
    'a c'
    'a d';
  grid-gap: 1rem;
`;

const Title = styled.h2`
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
