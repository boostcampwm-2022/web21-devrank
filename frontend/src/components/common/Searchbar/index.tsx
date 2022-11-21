import Image from 'next/image';
import styled, { css } from 'styled-components';
import { FormEvent, InputChangeEvent } from '@types';

type SubmitAlign = 'left' | 'right';

interface SearchbarProps {
  /**
   * input 태그의 type 속성
   */
  type: string;
  /**
   * 검색바 입력값
   */
  value: string;
  /**
   * 검색바 placeholder
   */
  placeholder: string;
  /**
   * 검색바 너비(px 빼고)  Ex 100
   */
  width: number;
  /**
   * 검색 버튼 위치 (left | right)
   */
  submitAlign: SubmitAlign;
  /**
   * 검색바 입력 이벤트 콜백함수
   */
  onChange: (e: InputChangeEvent) => void;
  /**
   * 검색폼 제출 이벤트 콜백함수
   */
  onSubmit: (e: FormEvent) => void;
}

interface StyledFormProps {
  width: number;
  submitAlign: SubmitAlign;
}

function Searchbar({
  type = 'text',
  value,
  placeholder,
  width,
  submitAlign,
  onChange,
  onSubmit,
  ...props
}: SearchbarProps) {
  return (
    <Form width={width} submitAlign={submitAlign} onSubmit={onSubmit}>
      <Input type={type} value={value} placeholder={placeholder} onChange={onChange} {...props} />
      <SearchButton type='submit'>
        <Image src='/icons/search.svg' alt='검색버튼' width={24} height={24} />
      </SearchButton>
    </Form>
  );
}

export default Searchbar;

const Form = styled.form<StyledFormProps>`
  ${({ theme }) => theme.common.flexSpaceBetween};
  background-color: ${({ theme }) => theme.colors.black4};
  border: 1px solid ${({ theme }) => theme.colors.gray1};
  border-radius: 10px;
  padding: 10px;

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

  &::placeholder,
  &::-webkit-input-placeholder,
  &:-ms-input-placeholder {
    color: ${({ theme }) => theme.colors.gray1};
  }
`;

const SearchButton = styled.button`
  ${({ theme }) => theme.common.flexCenter};
  background-color: transparent;
  border: none;
`;
