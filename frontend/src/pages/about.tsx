import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { CubeIcon } from '@components/common';
import HeadMeta from '@components/common/HeadMeta';
import { requestTokenRefresh } from '@apis/auth';
import { DEVELOPER_INFORMATION } from '@utils/constants';

function About() {
  useQuery(['user'], () => requestTokenRefresh());
  const { t } = useTranslation(['tier', 'about', 'meta']);

  return (
    <>
      <HeadMeta title={t('meta:about-title')} description={t('meta:main-description')} />
      <Container>
        <Logo>
          <Image src='/icons/logo-main.svg' alt='Devrank 로고' width={550} height={230} quality={100} priority />
        </Logo>
        <Content>
          <Introduce>
            Hi, We are <Strong>Devrank!</Strong>
            <br />
            <br />
            {t('about:overview-1')}
            <br />
            {t('about:overview-2')}
            <br />
            <br />
            <Strong>{t('about:overview-3')}</Strong>
          </Introduce>
        </Content>
        <Content>
          <Title>{t('about:key-feature-heading')}</Title>
          <FeatureList>
            <li>&middot; {t('about:key-feature-1')}</li>
            <li>&middot; {t('about:key-feature-2')}</li>
            <li>&middot; {t('about:key-feature-3')}</li>
          </FeatureList>
        </Content>
        <Content>
          <Title>{t('about:rank-system-heading')}</Title>
          <RankSystem>
            <Rank>
              <CubeIcon tier={'yellow'} />
              <Strong>{t(`tier:yellow`)}</Strong>
              <p>0 ~ 99</p>
            </Rank>
            <Rank>
              <CubeIcon tier={'green'} />
              <Strong>{t(`tier:green`)}</Strong>
              <p>100 ~ 199</p>
            </Rank>
            <Rank>
              <CubeIcon tier={'mint'} />
              <Strong>{t(`tier:mint`)}</Strong>
              <p>200 ~ 499</p>
            </Rank>
            <Rank>
              <CubeIcon tier={'blue'} />
              <Strong>{t(`tier:blue`)}</Strong>
              <p>500 ~ 999</p>
            </Rank>
            <Rank>
              <CubeIcon tier={'purple'} />
              <Strong>{t(`tier:purple`)}</Strong>
              <p>1000 ~ 1999</p>
            </Rank>
            <Rank>
              <CubeIcon tier={'orange'} />
              <Strong>{t(`tier:orange`)}</Strong>
              <p>2000 ~ 4999</p>
            </Rank>
            <Rank>
              <CubeIcon tier={'red'} />
              <Strong>{t(`tier:red`)}</Strong>
              <p>5000 ~</p>
            </Rank>
          </RankSystem>
        </Content>
        <Content>
          <Title>{t('about:score-calucate-method-heading')}</Title>
          <ScoreInfo>
            <p>레포점수 = 최대 100개까지의 commit별 (레포 가중치) * (시간 가중치) 합 / 100</p>
            <p>이슈점수 = 최대 100개까지의 (레포 가중치) * (시간 가중치) 합 / 1000</p>
            <p>&nbsp;&nbsp; &middot; 레포 가중치 = Star 개수</p>
            <p>&nbsp;&nbsp; &middot; 시간 가중치 = (1 / 1.0019) ^ 지난 일 수</p>
            <p>커밋점수 = 개인레포 25개, 외부레포 25개의 레포점수 합</p>
            <p>유저활동점수 = 커밋점수 + 이슈점수</p>
            <p>유저개인점수 = 팔로워수 / 100</p>
            <br />
            <p>유저점수 = 유저활동점수 + 유저개인점수</p>
            <br />
            <Strong>⚠️ 주의</Strong>
            <br />
            &middot; y = (1 / 1.0019) ^ x는 1년이 지났을때 시간가중치가 0.5가 되는 지수함수 <br />
            &middot; 코드가 아닌 문서레포의 기여의 비정상적인 가중치를 제외하기 위하여 <br />
            &nbsp;&nbsp;문서 위주 레포는 레포점수 0점
            <br />
            &middot; branch가 많아질경우 값이 커질 수 있음
            <br />
            &middot; collaborator로 등록되지않은 조직 레포는 집계되지 않음
            <br />
            &middot; 외부레포는 star 순으로 정렬이 되지 않음
          </ScoreInfo>
        </Content>
        <Content>
          <Title>Developed By</Title>
          {DEVELOPER_INFORMATION.map(({ name, introduction, field, career }) => (
            <Profile key={name}>
              <Name>
                {name}
                <div>
                  <Image src='/icons/github.svg' alt='깃허브 아이콘' width={20} height={20} quality={100} />
                  <Image src='/icons/link.svg' alt='링크 아이콘' width={20} height={20} quality={100} />
                </div>
              </Name>
              <Description>
                <li>&middot; 개발경력 : {career}</li>
                <li>&middot; 담당 : {field}</li>
                <li>&middot; {introduction}</li>
              </Description>
            </Profile>
          ))}
        </Content>
      </Container>
    </>
  );
}

export default About;

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale as string, [
        'about',
        'tier',
        'meta',
        'common',
        'header',
        'footer',
      ])),
    },
  };
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScoreInfo = styled.div`
  margin: auto;
  padding: 30px;
  width: max-content;
  margin-top: 30px;
  line-height: 26px;
  background-color: ${({ theme }) => theme.colors.black4};

  strong {
    font-size: ${({ theme }) => theme.fontSize.lg};
  }
`;
const Title = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.xl};
`;

const Strong = styled.strong`
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const Logo = styled.h2`
  margin-top: 100px;
  margin-bottom: 100px;
`;

const Introduce = styled.h3`
  width: 100%;
  line-height: 1.5rem;
`;

const Content = styled.div`
  width: 988px;
  padding: 30px 35px 45px 35px;
  border-top: 1px solid ${({ theme }) => theme.colors.gray1};

  &:first-of-type {
    border: none;
  }
`;

const FeatureList = styled.ul`
  height: 100px;
  margin-top: 30px;
  ${({ theme }) => theme.common.flexColumn}
  gap: 20px;
`;

const RankSystem = styled.ul`
  ${({ theme }) => theme.common.flexCenterColumn}
  gap: 5px;
  background-color: ${({ theme }) => theme.colors.black4};
  margin: auto;
  margin-top: 30px;
  width: 250px;
  padding: 20px;
  padding-right: 30px;
`;

const Rank = styled.li`
  width: max-content;
  display: grid;
  grid-template-columns: 45px 70px 55px;
  align-items: center;

  p {
    width: max-content;
    font-size: ${({ theme }) => theme.fontSize.xs};
  }
`;

const Profile = styled.div`
  margin-top: 30px;
  width: max-content;
  height: 104px;
  border-left: 2px solid ${({ theme }) => theme.colors.gray1};

  &:first-of-type {
    margin-top: 45px;
  }
  img {
    margin-right: 5px;
  }
`;

const Name = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xl};
  color: ${({ theme }) => theme.colors.logo};
  margin-left: 20px;
  ${({ theme }) => theme.common.flexCenter}
  gap: 10px;
`;

const Description = styled.div`
  height: 100px;
  margin-top: 12px;
  font-size: ${({ theme }) => theme.fontSize.xs};
  ${({ theme }) => theme.common.flexColumn}
  gap: 14px;
  margin-left: 25px;

  li {
    list-style: none;
  }
`;
