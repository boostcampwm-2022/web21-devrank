import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useInterval } from '@hooks/useInterval';

interface ProfileRefreshButtonProps {
  updateDelayTime: number;
  updateData: () => void;
  isLoading: boolean;
}
function ProfileRefreshButton({ updateDelayTime, updateData, isLoading }: ProfileRefreshButtonProps) {
  const [count, setCount] = useState(updateDelayTime);

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
      ) : count > 0 ? (
        <Timer>
          <span>{count}</span>초후 업데이트 가능합니다.
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
  width: 200px;
  cursor: initial;
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
