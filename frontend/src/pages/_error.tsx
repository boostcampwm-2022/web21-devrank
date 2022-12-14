import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Button } from '@components/common';
import { aldrich, lineSeedKR } from '@utils/fonts';
import { ssgWrapper } from '@utils/wrapper';

function Error() {
  const router = useRouter();

  const { t } = useTranslation(['500', 'meta']);

  return (
    <>
      <Head>
        <title>{t('meta:server-error-title')}</title>
      </Head>
      <Container className={aldrich.className}>
        <div>
          <h2>Oops!</h2>
          <CubeImage
            src='/icons/cube/cube-small-invalid.svg'
            alt='큐브 이미지'
            width={220}
            height={250}
            quality={100}
            priority
          />
        </div>
        <strong>500 - Internal Server Error</strong>
        <p className={lineSeedKR.className}>{t('500:500-information')}</p>
        <HomeButton onClick={() => router.push('/')}>GO TO MAIN PAGE</HomeButton>
      </Container>
    </>
  );
}

export default Error;

export const getStaticProps: GetStaticProps = ssgWrapper(['common', 'footer', 'header', '500', 'meta']);

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
  z-index: -1;
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
