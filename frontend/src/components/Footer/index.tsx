import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

function Footer() {
  const { t } = useTranslation('footer');

  return (
    <FooterContainer>
      <p>{t('copyright')}</p>
      <p>
        <span>{t('contribute')}</span>
        <a href="https://github.com/boostcampwm-2022/web21-devrank">
          <Image src="/icons/github.svg" alt="github icon" width={24} height={24} quality={100} />
        </a>
      </p>
    </FooterContainer>
  );
}

export default Footer;

const FooterContainer = styled.footer`
  ${({ theme }) => theme.common.flexCenterColumn};
  background-color: ${({ theme }) => theme.colors.black2};
  font-size: ${({ theme }) => theme.fontSize.sm};
  width: 100%;
  height: 176px;

  p {
    font-weight: ${({ theme }) => theme.fontWeight.medium};

    &:first-child {
      margin-bottom: 8px;
    }

    &:last-child {
      ${({ theme }) => theme.common.flexCenter};
      gap: 4px;
    }
  }
`;
