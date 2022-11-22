import styled, { css, keyframes } from 'styled-components';

interface SpinnerProps {
  /**
   * Spinner의 사이즈를 설정합니다.
   */
  size: number;
}

function Spinner({ size }: SpinnerProps) {
  return <StyledSpinner size={size} />;
}

export default Spinner;

const rotation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }`;

const StyledSpinner = styled.div<SpinnerProps>`
  border: 4px solid ${({ theme }) => theme.colors.yellow1};
  border-top-color: transparent;
  border-right-color: transparent;
  border-radius: 50%;
  animation: ${rotation} 1s linear infinite;

  ${(props) =>
    props.size &&
    css`
      width: ${props.size}px;
      height: ${props.size}px;
    `}
`;
