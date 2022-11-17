import styled, { css, keyframes } from 'styled-components';

interface SpinnerProps {
  /**
   * Spinner의 너비를 설정합니다.
   */
  width: number;
  /**
   * Spinner의 높이를 설정합니다.
   */
  height: number;
}

function Spinner({ width, height }: SpinnerProps) {
  return <StyledSpinner width={width} height={height} />;
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
    props.width &&
    css`
      width: ${props.width}px;
      height: ${props.height}px;
    `}
`;
