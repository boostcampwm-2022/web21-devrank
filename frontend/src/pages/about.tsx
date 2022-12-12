import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { CubeIcon } from '@components/common';
import HeadMeta from '@components/common/HeadMeta';
import { requestTokenRefresh } from '@apis/auth';
import { DEVELOPER_INFORMATION } from '@utils/constants';
import { ssgWrapper } from '@utils/wrapper';

function About() {
  useQuery(['user'], () => requestTokenRefresh(), {
    cacheTime: Infinity,
  });
  const { t } = useTranslation(['tier', 'about', 'meta']);

  return (
    <>
      <HeadMeta title={t('meta:about-title')} description={t('meta:main-description')} />
      <Container>
        {}
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
          <Title>{t('about:score-calculate-method-heading')}</Title>
          <ScoreInfo>
            <p>{t('about:score-calculate-method-1')}</p>
            <p>{t('about:score-calculate-method-2')}</p>
            <p>&nbsp;&nbsp; {t('about:score-calculate-method-3')}</p>
            <p>&nbsp;&nbsp; {t('about:score-calculate-method-4')}</p>
            <p>{t('about:score-calculate-method-5')}</p>
            <p>{t('about:score-calculate-method-6')}</p>
            <p>{t('about:score-calculate-method-7')}</p>
            <p>{t('about:score-calculate-method-8')}</p>
            <br />
            <p>{t('about:score-calculate-method-9')}</p>
            <br />
            <Strong>{t('about:score-calculate-method-10')}</Strong>
            <br />
            {t('about:score-calculate-method-11')}
            <br />
            {t('about:score-calculate-method-12')}
            <br />
            {t('about:score-calculate-method-13')}
            <br />
            {t('about:score-calculate-method-14')}
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

export const getStaticProps: GetStaticProps = ssgWrapper(['about', 'tier', 'meta', 'common', 'header', 'footer']);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

const ScoreInfo = styled.div`
  margin: auto;
  padding: 30px;
  width: max-content;
  margin-top: 30px;
  line-height: 30px;
  background-color: ${({ theme }) => theme.colors.black4};
  max-width: 750px;

  strong {
    font-size: ${({ theme }) => theme.fontSize.lg};
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
