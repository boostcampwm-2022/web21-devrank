import { DropdownItemProps } from '@types';
import styled from 'styled-components';

function DropdownItem({ children }: DropdownItemProps) {
  return <Container>{children}</Container>;
}

export default DropdownItem;

const Container = styled.li`
${({theme}) => theme.common.flexCenter};
  gap:5px;
  width: max-content;
  min-width: 95px;
  height: 35px;
  padding: 25px 10px;
  cursor: pointer;
`;
