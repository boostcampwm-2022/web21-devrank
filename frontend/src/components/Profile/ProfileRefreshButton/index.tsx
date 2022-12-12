import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useInterval } from '@hooks/useInterval';

interface ProfileRefreshButtonProps {
  updateDelayTime: number;
  updateData: () => void;
  isLoading: boolean;
  isMine: boolean;
}
function ProfileRefreshButton({ updateDelayTime, updateData, isLoading, isMine }: ProfileRefreshButtonProps) {
  const [count, setCount] = useState(updateDelayTime);
  const { t, i18n } = useTranslation('profile');

  useInterval(() => {
    setCount(count - 1);
  }, 1000);

  useEffect(() => {
    setCount(updateDelayTime);
  }, [updateDelayTime, isLoading]);

  return (
    <Container>
      {isLoading ? (
        <Image src='/icons/refresh.svg' width={32} height={32} alt='refresh' className='active' />
      ) : count > 0 && !isMine ? (
        <Timer>
          {i18n.language === 'ko' ? (
            <>
              <span>{count}</span>
              <p>{t('user-update-delay')}</p>
            </>
          ) : (
            <>
              <p>{t('user-update-delay')}</p>
              <span>{count}</span>
              <p>&nbsp;seconds</p>
            </>
          )}
        </Timer>
      ) : (
        <Image src='/icons/refresh.svg' width={32} height={32} alt='refresh' onClick={updateData} />
      )}
    </Container>
  );
}

export default ProfileRefreshButton;

const rotation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }`;

const Timer = styled.div`
  cursor: initial;

  p {
    display: inline-block;
  }

  span {
    display: inline-block;
    font-weight: 700;
    text-align: end;
    margin-right: 1px;
    width: 30px;
  }
`;

const Container = styled.div`
  ${({ theme }) => theme.common.flexCenter};
  width: max-content;
  height: 32px;
  cursor: pointer;
  .active {
    animation: ${rotation} 1s cubic-bezier(0.06, 0.14, 0.27, 0.96) infinite;
    cursor: not-allowed;
  }
`;
