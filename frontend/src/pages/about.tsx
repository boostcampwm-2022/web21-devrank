import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';
import { CubeIcon } from '@components/common';

function About() {
  const { t } = useTranslation(['tier', 'about']);
  return (
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
          <div>&middot; {t('about:key-feature-1')}</div>
          <div>&middot; {t('about:key-feature-2')}</div>
          <div>&middot; {t('about:key-feature-3')}</div>
        </FeatureList>
      </Content>
      <Content>
        <Title>{t('about:rank-system-heading')}</Title>
        <RankSystem>
          <Rank>
            <CubeIcon tier='yellow' />
            <Strong>{t('tier:yellow')}</Strong>
            <p>0~100</p>
          </Rank>
          <Rank>
            <CubeIcon tier='green' />
            <Strong>{t('tier:green')}</Strong>
            <p>101~200</p>
          </Rank>
          <Rank>
            <CubeIcon tier='mint' />
            <Strong>{t('tier:mint')}</Strong>
            <p>201~300</p>
          </Rank>
          <Rank>
            <CubeIcon tier='blue' />
            <Strong>{t('tier:blue')}</Strong>
            <p>301~400</p>
          </Rank>
          <Rank>
            <CubeIcon tier='purple' />
            <Strong>{t('tier:purple')}</Strong>
            <p>401~500</p>
          </Rank>
          <Rank>
            <CubeIcon tier='orange' />
            <Strong>{t('tier:orange')}</Strong>
            <p>501~600</p>
          </Rank>
          <Rank>
            <CubeIcon tier='red' />
            <Strong>{t('tier:red')}</Strong>
            <p>601~</p>
          </Rank>
        </RankSystem>
      </Content>
      <Content>
        <Title>{t('about:score-calucate-method-heading')}</Title>
      </Content>
      <Content>
        <Title>Developed By</Title>
        <Profile>
          <Name>
            장우석
            <div>
              <Image src='/icons/github.svg' alt='깃허브 아이콘' width={20} height={20} quality={100} />
              <Image src='/icons/link.svg' alt='링크 아이콘' width={20} height={20} quality={100} />
            </div>
          </Name>
          <Description>
            <div>&middot; 개발경력 : 1년</div>
            <div>&middot; 담당 : Backend</div>
            <div>&middot; 자기소개</div>
          </Description>
        </Profile>
        <Profile>
          <Name>
            강시온
            <div>
              <Image src='/icons/github.svg' alt='깃허브 아이콘' width={20} height={20} quality={100} />
              <Image src='/icons/link.svg' alt='링크 아이콘' width={20} height={20} quality={100} />
            </div>
          </Name>
          <Description>
            <div>&middot; 개발경력 : ?년</div>
            <div>&middot; 담당 : Backend</div>
            <div>&middot; 자기소개</div>
          </Description>
        </Profile>
        <Profile>
          <Name>
            정윤규
            <div>
              <Image src='/icons/github.svg' alt='깃허브 아이콘' width={20} height={20} quality={100} />
              <Image src='/icons/link.svg' alt='링크 아이콘' width={20} height={20} quality={100} />
            </div>
          </Name>
          <Description>
            <div>&middot; 개발경력 : 1년</div>
            <div>&middot; 담당 : Frontend</div>
            <div>&middot; 자기소개</div>
          </Description>
        </Profile>
        <Profile>
          <Name>
            정성윤
            <div>
              <Image src='/icons/github.svg' alt='깃허브 아이콘' width={20} height={20} quality={100} />
              <Image src='/icons/link.svg' alt='링크 아이콘' width={20} height={20} quality={100} />
            </div>
          </Name>
          <Description>
            <div>&middot; 개발경력 : 1년</div>
            <div>&middot; 담당 : Frontend</div>
            <div>&middot; 자기소개</div>
          </Description>
        </Profile>
      </Content>
    </Container>
  );
}

export default About;

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale as string, ['about', 'tier', 'common', 'header', 'footer'])),
    },
  };
};

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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  margin-top: 30px;
  width: 100%;
`;

const Rank = styled.li`
  width: max-content;
  display: grid;
  grid-template-columns: 45px 70px 55px;
  align-items: center;

  p {
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
`;
