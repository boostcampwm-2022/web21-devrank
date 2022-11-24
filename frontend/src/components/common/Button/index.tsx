import styled, { css } from 'styled-components';
import { ButtonClickEvent } from '@type/common';

type ButtonSize = 'sm' | 'md';

interface ButtonProps {
  /** Button 내부 label 텍스트 */
  children: React.ReactNode;
  /** Button 크기 (sm => small, md => medium) */
  size?: ButtonSize;
  /** Button 동작 여부 */
  disabled?: boolean;
  /** Button click시 실행되는 함수 */
  onClick?: (e: ButtonClickEvent) => void;
}

interface StyledButtonProps {
  size?: ButtonSize;
}

function Button({ children, size = 'md', disabled, onClick, ...props }: ButtonProps) {
  return (
    <StyledButton type='button' size={size} disabled={disabled} onClick={onClick} {...props}>
      {children}
    </StyledButton>
  );
}

export default Button;

const StyledButton = styled.button<StyledButtonProps>`
  ${({ theme }) => theme.common.flexCenter};
  font-size: ${({ theme }) => theme.fontSize.sm};
  background-color: ${({ theme }) => theme.colors.black2};
  border: 2px solid ${({ theme }) => theme.colors.gray1};
  border-radius: 8px;
  width: 95px;
  height: 40px;

  position: relative;

  z-index: 10;

  ${(props) =>
    props.size === 'sm' &&
    css`
      font-size: ${({ theme }) => theme.fontSize.sm};
      width: 80px;
      height: 36px;
    `}

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray4};
  }
`;
