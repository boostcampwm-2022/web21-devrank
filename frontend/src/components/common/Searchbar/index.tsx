import Image from 'next/image';
import { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useInput } from '@hooks';
import { FormEvent } from '@type/common';
import useDebounce from '@hooks/useDebounce';

type SubmitAlign = 'left' | 'right';

interface SearchbarProps {
  /** input 태그의 type 속성 */
  type: string;
  /** 검색바 placeholder */
  placeholder: string;
  /** 검색바 너비(px 빼고)  Ex 100 */
  width: number;
  /** 검색 버튼 위치 (left | right) */
  submitAlign: SubmitAlign;
  /** 검색폼 제출 핸들러 함수 */
  onSearch: (username: string) => void;
}

interface StyledFormProps {
  width: number;
  submitAlign: SubmitAlign;
}

function Searchbar({ type = 'text', placeholder, width, submitAlign, onSearch, ...props }: SearchbarProps) {
  const { input, onInputChange, inputReset } = useInput('');

  const debounceValue = useDebounce({ value: input, delay: 300 });

  useEffect(() => {
    console.log(debounceValue);
  }, [debounceValue]);

  const onInputSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(input);
    inputReset();
  };

  return (
    <Form width={width} submitAlign={submitAlign} onSubmit={onInputSubmit}>
      <Input type={type} value={input} placeholder={placeholder} onChange={onInputChange} {...props} />
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
  ${({ theme }) => theme.common.flexCenter};
  background-color: transparent;
  border: none;
`;
