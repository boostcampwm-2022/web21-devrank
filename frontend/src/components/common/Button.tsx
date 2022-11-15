import styled, { css } from 'styled-components';
import { ButtonProps, StyledButtonProps } from '@types';

function Button({ label, size = 'md', disabled, onClick, ...props }: ButtonProps) {
  return (
    <StyledButton type="button" size={size} disabled={disabled} onClick={onClick} {...props}>
      {label}
    </StyledButton>
  );
}

export default Button;

const StyledButton = styled.button<StyledButtonProps>`
  ${({ theme }) => theme.common.flexCenter};
  font-size: ${({ theme }) => theme.fontSize.md};
  background-color: ${({ theme }) => theme.colors.black2};
  border: 1px solid ${({ theme }) => theme.colors.gray2};
  border-radius: 8px;
  width: 120px;
  height: 48px;

  ${(props) =>
    props.size === 'sm' &&
    css`
      font-size: ${({ theme }) => theme.fontSize.sm};
      width: 80px;
      height: 36px;
    `}

  &:hover {
    background-color: ${({ theme }) => theme.colors.black3};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray4};
  }
`;
