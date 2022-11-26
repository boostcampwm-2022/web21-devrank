import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Button } from '@components/common';
import { aldrich, lineSeedKR } from '@utils/fonts';

function NotFound() {
  const router = useRouter();

  const { t } = useTranslation(['404']);

  return (
    <Container className={aldrich.className}>
      <div>
        <h2>Oops!</h2>
        <CubeImage
          src='/icons/cube-large-background.svg'
          alt='큐브 이미지'
          width={220}
          height={250}
          quality={100}
          priority
        />
      </div>
      <strong>404 - PAGE NOT FOUND</strong>
      <p className={lineSeedKR.className}>{t('404-information')}</p>
      <HomeButton onClick={() => router.push('/')}>GO TO MAIN PAGE</HomeButton>
    </Container>
  );
}

export default NotFound;

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale as string, ['common', 'footer', 'header', '404'])),
    },
  };
};

const Container = styled.div`
  ${({ theme }) => theme.common.flexCenterColumn};
  padding: 150px 0px;
  flex: 1;

  div {
    position: relative;
    margin-bottom: 40px;

    h2 {
      font-size: 120px;
    }
  }

  strong {
    font-size: 40px;
    margin-bottom: 80px;
  }

  p {
    margin-bottom: 100px;
  }
`;

const CubeImage = styled(Image)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const HomeButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.black3};
  border-color: ${({ theme }) => theme.colors.gray1};
  border-radius: 75px;
  width: 200px;
  padding: 25px 0px;
`;
