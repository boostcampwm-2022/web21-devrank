import { Trans } from 'next-i18next';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
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

  const countDown = useCallback(() => setCount((prev) => prev - 1), []);

  useInterval(countDown, 1000, count > 0);

  useEffect(() => {
    setCount(updateDelayTime);
  }, [updateDelayTime, isLoading]);

  return (
    <Container>
      {isLoading ? (
        <Image src='/icons/refresh.svg' width={32} height={32} alt='refresh' className='active' />
      ) : count > 0 && !isMine ? (
        <Timer>
          <Trans i18nKey='profile:user-update-delay' values={{ count }} components={{ count: <span /> }} />
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
    width: 25px;
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
