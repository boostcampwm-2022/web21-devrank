import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { RankingResponse } from '@type/response';
import { Avatar } from '@components/common';
import useDebounce from '@hooks/useDebounce';
import { requestRankingByUsername } from '@apis/ranking';
import { AUTO_COMPLETE_LIMIT, SEARCH_DEBOUNCE_DELAY } from '@utils/constants';

// interface InputProps {
//   children: React.ReactNode;
// }

// function Input({ children }: InputProps) {
//   const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     console.log(e.key);
//   };
//   return <div onKeyDown={onKeyDown}>{children}</div>;
// }

// interface DropdownProps {
//   children: React.ReactNode;
// }

// function Dropdown({ children }: DropdownProps) {
//   return <div>{children}</div>;
// }

interface AutoCompleteProps {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  inputRef: React.MutableRefObject<HTMLFormElement | null>;
}

interface StyledUserProps {
  isFocus: boolean;
}

function AutoComplete({ input, setInput, inputRef }: AutoCompleteProps) {
  const searchInput = useDebounce({ value: input, delay: SEARCH_DEBOUNCE_DELAY });
  const router = useRouter();
  const [focusIdx, setFocusIdx] = useState<number>(-1);

  const usersRef = useRef<any>([]);

  const searchUser = (username: string) => {
    router.push(`/profile/${username}`);
  };

  const { data } = useQuery<RankingResponse[]>(
    ['search', searchInput],
    () => requestRankingByUsername({ username: searchInput, limit: AUTO_COMPLETE_LIMIT }),
    {
      enabled: searchInput.length > 0,
    },
  );

  const setUpFocus = (prev: number) => {
    if (prev === data?.length || 0 - 1) {
      return 0;
    } else {
      return prev + 1;
    }
  };

  const setDownFocus = (prev: number) => {
    if (prev === 0) {
      return data?.length || 0 - 1;
    } else {
      return prev - 1;
    }
  };

  const focusHandler = (e: KeyboardEvent) => {
    console.log(e.key);
    switch (e.key) {
      case 'ArrowDown':
        setFocusIdx(setDownFocus);
        break;
      case 'ArrowUp':
        setFocusIdx(setUpFocus);
        break;
      case 'Tab':
        setFocusIdx(setDownFocus);
        break;
      case 'Escape':
        setFocusIdx(-1);
        break;
      default:
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener('keydown', focusHandler);
    }
    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener('keydown', focusHandler);
      }
    };
  }, [inputRef]);

  if (!data || data.length === 0) return null;

  return (
    <Container>
      <ul>
        {data.map((user, index) => (
          <User
            key={user.id}
            ref={(el) => (usersRef.current[index] = el)}
            onClick={() => searchUser(user.username)}
            isFocus={index === focusIdx}
          >
            <Avatar src={user.avatarUrl} size='sm' />
            <span>{user.username}</span>
          </User>
        ))}
      </ul>
    </Container>
  );
}

export default AutoComplete;

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.black4};
  border: 1px solid ${({ theme }) => theme.colors.gray1};
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top: none;
  width: 600px;
  height: max-content;
  padding: 0 15px;

  position: absolute;
  top: 35px;
  left: -1px;

  z-index: 10;

  ul {
    ${({ theme }) => theme.common.flexSpaceBetweenColumn};
    align-items: flex-start;
    border-top: 1px solid ${({ theme }) => theme.colors.gray1};
    width: 100%;
    margin-top: 10px;
    padding: 15px 5px;
    gap: 15px;
  }
`;

const User = styled.li<StyledUserProps>`
  ${({ theme }) => theme.common.flexCenter};
  justify-content: flex-start;
  width: 100%;
  height: 40px;
  gap: 10px;

  cursor: pointer;

  ${(props) =>
    props.isFocus &&
    css`
      background-color: yellow;
    `}
`;
