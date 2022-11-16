import styled from 'styled-components';
import { DropdownProps } from '@types'

function Dropdown({ children }: DropdownProps) {
  return (<Container><ul>{children}</ul></Container>);
}

export default Dropdown;


const Container = styled.div`
  ${({ theme }) => theme.common.flexCenterColumn};
  font-size: ${({ theme }) => theme.fontSize.sm};
  background-color: ${({ theme }) => theme.colors.black2};
  border: 2px solid ${({ theme }) => theme.colors.gray1};
  border-radius:8px;
  padding: 0px 5px;

  li + li {
    border-top: 2px solid ${({ theme }) => theme.colors.gray1};
  }
`;
