import styled, { css } from 'styled-components';

interface PaperProps {
  /** 내부 컨텐츠 노드 */
  children?: React.ReactNode;
  /** 가로 길이 */
  width?: number;
  /** 배경 색깔 */
  fill?: string;
}

interface StyledContainerProps {
  width?: number;
  fill?: string;
}

function Paper({ children, width, fill }: PaperProps) {
  return (
    <Container width={width} fill={fill}>
      {children}
    </Container>
  );
}

export default Paper;

const Container = styled.div<StyledContainerProps>`
  ${({ theme }) => theme.common.flexSpaceBetween};
  ${({ theme }) => theme.common.boxShadow};
  background-color: ${({ theme }) => theme.colors.black5};
  border-radius: 8px;
  padding: 30px;
  width: 100%;

  ${(props) =>
    props.width &&
    css`
      width: ${props.width}px;
    `}

  ${(props) =>
    props.fill &&
    css`
      background-color: ${props.fill};
    `}
`;
