import styled from 'styled-components';
import { ClickEvent } from '@type/common';

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: (e: ClickEvent) => void;
}

function DropdownItem({ children, onClick }: DropdownItemProps) {
  return <Container onClick={onClick}>{children}</Container>;
}

export default DropdownItem;

const Container = styled.li`
  ${({ theme }) => theme.common.flexCenter};
  gap: 5px;
  width: max-content;
  min-width: 95px;
  height: 35px;
  padding: 25px 10px;
  cursor: pointer;
`;
