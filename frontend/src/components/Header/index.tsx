import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Avatar, Button } from '@components/common';
import Dropdown from '@components/common/Dropdown';
import { requestTokenRefresh, requestUserLogout } from '@apis/auth';
import { GITHUB_AUTH_REQUEST_URL } from '@utils/constants';

function Header() {
  const { mutate: logout } = useMutation({
    mutationFn: requestUserLogout,
  });

  const { isLoading, data: userData, remove: removeUser } = useQuery(['user'], () => requestTokenRefresh());
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
            <Link href='/ranking?tier=all&page=1'>{t('header:navigate-ranking')}</Link>
          </li>
        </NavMenu>
        <ButtonGroup>
          <Dropdown>
            <Dropdown.Trigger>
              <LanguageButton size='md'>
                <Image src='/icons/globe.svg' alt='언어 선택 버튼' width={25} height={25} />
                <span>{t('common:current-locale')}</span>
              </LanguageButton>
            </Dropdown.Trigger>
            <Dropdown.ItemList>
              <Link href={router.asPath} locale='ko'>
                <Dropdown.Item>한국어</Dropdown.Item>
              </Link>
              <Link href={router.asPath} locale='en'>
                <Dropdown.Item>English</Dropdown.Item>
              </Link>
            </Dropdown.ItemList>
          </Dropdown>
          <div className='button-right'>
            {isLoading ? (
              <div></div>
            ) : userData ? (
              <Dropdown>
                <Dropdown.Trigger>
                  <Avatar src={userData.avatarUrl} />
                </Dropdown.Trigger>
                <Dropdown.ItemList>
                  <Dropdown.Item onClick={() => router.push(`/profile/${userData.username}`)}>
                    <Image src='/icons/profile.svg' alt='프로필 아이콘' width={17} height={17} quality={100} />
                    {t('common:my-profile')}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={onClickLogoutButton}>
                    <Image src='/icons/logout.svg' alt='로그아웃 아이콘' width={17} height={17} quality={100} />
                    {t('common:logout')}
                  </Dropdown.Item>
                </Dropdown.ItemList>
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
