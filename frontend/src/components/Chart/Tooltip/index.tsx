import styled from 'styled-components';

interface TooltipProps {
  children: React.ReactNode;
}

function Tooltip({ children }: TooltipProps) {
  return <StyledTooltip>{children}</StyledTooltip>;
}

export default Tooltip;

const StyledTooltip = styled.div`
  background-color: ${({ theme }) => theme.colors.gray7};
  padding: 10px;
  border-radius: 8px;
`;
