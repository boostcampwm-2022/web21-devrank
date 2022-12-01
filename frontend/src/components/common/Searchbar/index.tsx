import Image from 'next/image';
import styled, { css } from 'styled-components';
import { FormEvent } from '@type/common';

type SubmitAlign = 'left' | 'right';

interface SearchbarProps {
  children?: React.ReactNode;
  /** input 태그의 type 속성 */
  type: string;
  /** 검색바 placeholder */
  placeholder: string;
  /** 검색바 너비(px 빼고)  Ex 100 */
  width: number;
  /** 검색 버튼 위치 (left | right) */
  submitAlign: SubmitAlign;
  /** 검색바 input string */
  input: string;
  /** 검색바 입력 이벤트 핸들러 함수 */
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** 검색폼 제출 핸들러 함수 */
  onSearch: (e: FormEvent) => void;
  /** 검색바 키보드 이벤트 핸들러 함수 */
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

interface StyledFormProps {
  width: number;
  submitAlign: SubmitAlign;
}

function Searchbar({
  children,
  type = 'text',
  placeholder,
  width,
  submitAlign,
  input,
  onInputChange,
  onSearch,
  onKeyDown,
}: SearchbarProps) {
  return (
    <Form width={width} submitAlign={submitAlign} onSubmit={onSearch}>
      <Input type={type} value={input} placeholder={placeholder} onChange={onInputChange} onKeyDown={onKeyDown} />
      <SearchButton type='submit'>
        <Image src='/icons/search.svg' alt='검색버튼' width={24} height={24} />
      </SearchButton>
      {children}
    </Form>
  );
}

export default Searchbar;

const Form = styled.form<StyledFormProps>`
  position: relative;
  background-color: ${({ theme }) => theme.colors.black4};
  border: 1px solid ${({ theme }) => theme.colors.gray1};
  border-radius: 10px;
  padding: 10px 15px;

  ${(props) =>
    props.width &&
    css`
      width: ${props.width}px;
    `}

  ${(props) =>
    props.submitAlign === 'left' &&
    css`
      flex-direction: row-reverse;
    `}
`;

const Input = styled.input`
  background-color: transparent;
  width: 100%;
  border: none;
  outline: none;
  line-height: 16px;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray6};
  }
  &::-webkit-input-placeholder {
    color: ${({ theme }) => theme.colors.gray6};
  }
  &:-ms-input-placeholder {
    color: ${({ theme }) => theme.colors.gray6};
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 8px;
  top: 8px;
  background-color: transparent;
  border: none;
`;
