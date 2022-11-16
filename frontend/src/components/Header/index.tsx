
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react'
import styled from 'styled-components';
import {  Avatar, Button,Dropdown, DropdownItem } from '@components/common';
import useDropdown from '@hooks/useDropdown';
import { AuthContext } from '@contexts/authContext';

interface StyledDropdownContainer {
  left?: number,
  bottom?: number,
}

function Header() {
  const { t } = useTranslation(['header', 'common']);
  const  isLoggedIn = useContext(AuthContext);

  const { isOpen: languageIsOpen, toggleDropdown: toggleLanguageDropdown } = useDropdown();
  const { isOpen: profileIsOpen, toggleDropdown: toggleProfileDropdown } = useDropdown();

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
          <LanguageButton size='md' onClick={toggleLanguageDropdown}>
            <Image src="/icons/globe.svg" alt="언어 선택 버튼" width={25} height={25} />
            <span>{t('common:current-locale')}</span>
          </LanguageButton>
          {languageIsOpen && <DropdownContainer  bottom={-100} left={0}>
            <Dropdown>
              <DropdownItem>{t('common:language-ko')}</DropdownItem>
              <DropdownItem>{t('common:language-en')}</DropdownItem>
            </Dropdown>
          </DropdownContainer>}
          {isLoggedIn ? <Button size="md">
            {t('common:login-button')}
          </Button>:
            <Avatar src='/profile-dummy.png' onClick={toggleProfileDropdown}/>
          }
          {profileIsOpen && <DropdownContainer bottom={-100} left={120}>
            <Dropdown>
              <DropdownItem>
                <Image src='/icons/profile.svg' alt="프로필 아이콘" width={17} height={17} quality={100}/>
                {t('common:my-profile')}
              </DropdownItem>
              <DropdownItem>
                <Image src='/icons/logout.svg' alt="로그아웃 아이콘" width={17} height={17} quality={100}/>
                {t('common:logout')}
              </DropdownItem>
            </Dropdown>
          </DropdownContainer>}
        </ButtonGroup>
      </nav>
    </Container>
  );
}

export default Header;

const Container = styled.header`
  background-color: ${({ theme }) => theme.colors.black2};
  width: 100%;
  height: ${({ theme }) => theme.component.headerHeight};

  nav {
    ${({ theme }) => theme.common.flexSpaceBetween};
    max-width:1600px;
    width:100%;
    height:100%;
    margin:0 auto;
    padding: 40px;
  }

  h1, li {
    cursor: pointer;
  }
`;

const NavMenu = styled.ul`
  width: 65%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: ${({ theme }) => theme.fontSize.lg};
  gap: 70px;
  padding-left: 60px;
`;

const ButtonGroup = styled.div`
  position: relative;
  ${({ theme }) => theme.common.flexCenter};
`;

const LanguageButton = styled(Button)`
  font-size: ${({ theme }) => theme.fontSize.md};
  background-color: transparent;
  border: none;
  gap: 4px;
  margin-right: 50px;

  span {
    line-height: 24px;
  }
`;

const DropdownContainer = styled.div<StyledDropdownContainer>`
  position: absolute;
  ${(props)=> `
    bottom: ${props.bottom}px;
    left: ${props.left}px;
  `}
`;