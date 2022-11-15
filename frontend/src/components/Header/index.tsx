import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';
import { Button } from '@components/common';

function Header() {
  const { t } = useTranslation(['header', 'common']);

  return (
    <Container>
      <nav>
        <h1>
          <Link href="/">
            <Image src="/icons/devrank-logo.svg" alt="로고" width={196} height={43} />
          </Link>
        </h1>
        <NavMenu>
          <li>
            <Link href="/about">{t('header:navigate-about')}</Link>
          </li>
          <li>
            <Link href="/ranking">{t('header:navigate-ranking')}</Link>
          </li>
        </NavMenu>
        <ButtonGroup>
          <LanguageButton>
            <Image src="/icons/globe.svg" alt="언어 선택 버튼" width={25} height={25} />
            <span>{t('common:current-locale')}</span>
          </LanguageButton>
          <Button label={t('common:login-button')} size="md" onClick={(e) => console.log('')} />
        </ButtonGroup>
      </nav>
    </Container>
  );
}

export default Header;

const Container = styled.header`
  background-color: ${({ theme }) => theme.colors.black2};
  width: 100%;
  height ${({ theme }) => theme.component.headerHeight};

  nav {
    ${({ theme }) => theme.common.flexSpaceBetween};
    max-width:1600px;
    width:100%;
    height:100%;
    margin:0 auto;
    padding: 40px;
  }

  h1, li {
    cursur: pointer;
  }
`;

const NavMenu = styled.ul`
  width: 65%;
  display: flex;
  align-items: center;
  justify-contents: flex-start;
  font-size: ${({ theme }) => theme.fontSize.lg};
  gap: 70px;
  padding-left: 60px;
`;

const ButtonGroup = styled.div`
  ${({ theme }) => theme.common.flexCenter};
`;

const LanguageButton = styled.button`
  ${({ theme }) => theme.common.flexCenter};
  font-size: ${({ theme }) => theme.fontSize.md};
  background-color: transparent;
  border: none;
  outline: none;
  gap: 4px;
  margin-right: 20px;

  span {
    line-height: 24px;
  }
`;
