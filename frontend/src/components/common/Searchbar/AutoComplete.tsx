import Link from 'next/link';
import styled, { css } from 'styled-components';
import { RankingResponse } from '@type/response';
import { Avatar } from '@components/common';

interface AutoCompleteProps {
  searchList: RankingResponse[];
  focusIdx: number;
}

interface StyledUserProps {
  isFocus: boolean;
}

function AutoComplete({ searchList, focusIdx }: AutoCompleteProps) {
  if (searchList.length === 0) return null;

  return (
    <Container>
      <ul>
        {searchList.map((user, index) => (
          <li key={user.id}>
            <Link href={`/profile/${user.username}`}>
              <User key={user.id} isFocus={index === focusIdx}>
                <Avatar src={user.avatarUrl} size='sm' />
                <span>{user.username}</span>
              </User>
            </Link>
          </li>
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
    ${({ theme }) => theme.common.flexColumn};
    border-top: 1px solid ${({ theme }) => theme.colors.gray1};
    width: 100%;
    padding: 15px 0px;
    margin-top: 10px;
  }
`;

const User = styled.div<StyledUserProps>`
  ${({ theme }) => theme.common.flexCenter};
  justify-content: flex-start;
  border-radius: 8px;
  width: 100%;
  padding: 10px;
  gap: 10px;

  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.black1};
  }

  ${(props) =>
    props.isFocus &&
    css`
      background-color: ${({ theme }) => theme.colors.black1};
    `}
`;
