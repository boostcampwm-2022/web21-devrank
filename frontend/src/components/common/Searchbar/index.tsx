import Image from 'next/image';
import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useDebounce, useInput } from '@hooks';
import { useQuery } from '@tanstack/react-query';
import { FormEvent } from '@type/common';
import { RankingResponse } from '@type/response';
import AutoCompleteList from '@components/common/Searchbar/AutoComplete';
import { requestRankingByUsername } from '@apis/ranking';
import { AUTO_COMPLETE_LIMIT, SEARCH_DEBOUNCE_DELAY } from '@utils/constants';

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
  /** 자동 완성 */
  autoComplete: boolean;
  /** 검색폼 제출 핸들러 함수 */
  onSearch: (username: string) => void;
}

interface StyledFormProps {
  width: number;
  submitAlign: SubmitAlign;
}

function Searchbar({
  type = 'text',
  placeholder,
  width,
  submitAlign,
  onSearch,
  autoComplete,
  ...props
}: SearchbarProps) {
  const { input, setInput, onInputChange, inputReset } = useInput('');
  const searchInput = useDebounce({ value: input, delay: SEARCH_DEBOUNCE_DELAY });
  const [focusIdx, setFocusIdx] = useState(-1);

  const { data } = useQuery<RankingResponse[]>(
    ['search', searchInput],
    () => requestRankingByUsername({ username: searchInput, limit: AUTO_COMPLETE_LIMIT }),
    {
      enabled: searchInput.length > 0 && focusIdx === -1,
      keepPreviousData: searchInput.length > 0,
      cacheTime: 0,
    },
  );

  const onInputSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(input);
    inputReset();
  };

  const initFocus = () => {
    setFocusIdx(-1);
  };

  const focusHandler = (e: React.KeyboardEvent) => {
    if (!data) return;

    const userCount = data.length;

    switch (e.key) {
      case 'ArrowDown':
        setFocusIdx((focusIdx + 1) % userCount);
        break;
      case 'ArrowUp':
        setFocusIdx(focusIdx <= 0 ? userCount - 1 : focusIdx - 1);
        break;
      case 'Escape':
        inputReset();
        initFocus();
        break;
      default:
        initFocus();
    }
  };

  useEffect(() => {
    if (focusIdx === -1) return;

    if (data) {
      setInput(data[focusIdx].username);
    }
  }, [focusIdx]);

  return (
    <Form width={width} submitAlign={submitAlign} onSubmit={onInputSubmit}>
      <Input
        type={type}
        value={input}
        placeholder={placeholder}
        onChange={onInputChange}
        onKeyDown={focusHandler}
        {...props}
      />
      <SearchButton type='submit'>
        <Image src='/icons/search.svg' alt='검색버튼' width={24} height={24} />
      </SearchButton>
      {autoComplete && data && <AutoCompleteList data={data} focusIdx={focusIdx} />}
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
