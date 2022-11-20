import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useQueryData } from '@hooks';
import { useMutation } from '@tanstack/react-query';
import { Avatar, Button, Dropdown, DropdownItem } from '@components/common';
import { requestUserLogout } from '@apis/auth';
import { GITHUB_AUTH_REQUEST_URL } from '@utils/constants';

function Header() {
  const { mutate: logout } = useMutation({
    mutationFn: requestUserLogout,
  });
  const { queryData: userData, removeQueryData: removeUser } = useQueryData(['user']);
  const { t } = useTranslation(['header', 'common']);
  const router = useRouter();

  const onClickLoginButton = () => {
    localStorage.setItem('login-pathname', window.location.pathname);
    window.location.assign(GITHUB_AUTH_REQUEST_URL);
  };

  const onClickLogoutButton = () => {
    logout();
    removeUser();
  };

  return (
    <Container>
      <nav>
        <h1>
          <Link href='/'>
            <Image src='/icons/devrank-logo.svg' alt='로고' width={196} height={43} priority />
          </Link>
        </h1>
        <NavMenu>
          <li>
            <Link href='/about'>{t('header:navigate-about')}</Link>
          </li>
          <li>
            <Link href='/ranking'>{t('header:navigate-ranking')}</Link>
          </li>
        </NavMenu>
        <ButtonGroup>
          <Dropdown
            trigger={
              <LanguageButton size='md'>
                <Image src='/icons/globe.svg' alt='언어 선택 버튼' width={25} height={25} />
                <span>{t('common:current-locale')}</span>
              </LanguageButton>
            }
          >
            <DropdownItem>
              <Link href={router.pathname} locale='ko'>
                {t('common:language-ko')}
              </Link>
            </DropdownItem>
            <DropdownItem>
              <Link href={router.pathname} locale='en'>
                {t('common:language-en')}
              </Link>
            </DropdownItem>
          </Dropdown>
          <div className='button-right'>
            {userData ? (
              <Dropdown trigger={<Avatar src={userData.user.avatarUrl} />}>
                <DropdownItem>
                  <Image src='/icons/profile.svg' alt='프로필 아이콘' width={17} height={17} quality={100} />
                  {t('common:my-profile')}
                </DropdownItem>
                <DropdownItem onClick={onClickLogoutButton}>
                  <Image src='/icons/logout.svg' alt='로그아웃 아이콘' width={17} height={17} quality={100} />
                  {t('common:logout')}
                </DropdownItem>
              </Dropdown>
            ) : (
              <Button size='md' onClick={onClickLoginButton}>
                {t('common:login-button')}
              </Button>
            )}
          </div>
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
    max-width: 1600px;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    padding: 40px;
  }

  h1,
  li {
    cursor: pointer;
  }
`;

const NavMenu = styled.ul`
  ${({ theme }) => theme.common.flexRow};
  font-size: ${({ theme }) => theme.fontSize.lg};
  width: 65%;
  padding-left: 60px;
  gap: 70px;
`;

const ButtonGroup = styled.div`
  ${({ theme }) => theme.common.flexCenter};
  position: relative;
  gap: 40px;

  .button-right {
    ${({ theme }) => theme.common.flexCenter};
    width: 80px;
  }
`;

const LanguageButton = styled(Button)`
  font-size: ${({ theme }) => theme.fontSize.md};
  background-color: transparent;
  border: none;
  height: 58px;
  gap: 4px;

  span {
    line-height: 24px;
  }
`;
