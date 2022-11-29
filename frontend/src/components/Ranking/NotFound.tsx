import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';
import { aldrich, lineSeedKR } from '@utils/fonts';

function NotFound() {
  const { t } = useTranslation(['ranking']);

  return (
    <Container className={aldrich.className}>
      <div>
        <CubeImage
          src='/icons/cube-large-background.svg'
          alt='큐브 이미지'
          width={220}
          height={250}
          quality={100}
          priority
        />
      </div>
      <strong>NOT FOUND</strong>
      <p className={lineSeedKR.className}>{t('search-not-found')}</p>
    </Container>
  );
}

export default NotFound;

const Container = styled.div`
  position: relative;
  height: 600px;

  ${({ theme }) => theme.common.flexCenterColumn};

  strong {
    font-size: 40px;
    margin-bottom: 40px;
  }

  p {
    font-size: 28px;
    margin-bottom: 100px;
  }
`;
const CubeImage = styled(Image)`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
