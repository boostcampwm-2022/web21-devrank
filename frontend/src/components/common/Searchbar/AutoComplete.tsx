import { useRouter } from 'next/router';
import styled, { css } from 'styled-components';
import { RankingResponse } from '@type/response';
import { Avatar } from '@components/common';

interface AutoCompleteProps {
  focusIdx: number;
  data: RankingResponse[];
}

interface StyledUserProps {
  isFocus: boolean;
}

function AutoComplete({ data, focusIdx }: AutoCompleteProps) {
  const router = useRouter();

  const searchUser = (username: string) => {
    router.push(`/profile/${username}`);
  };

  if (data.length === 0) return null;

  return (
    <Container>
      <ul>
        {data.map((user, index) => (
          <User key={user.id} onClick={() => searchUser(user.username)} isFocus={index === focusIdx}>
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
    ${({ theme }) => theme.common.flexColumn};
    border-top: 1px solid ${({ theme }) => theme.colors.gray1};
    width: 100%;
    padding: 15px 0px;
    margin-top: 10px;
  }
`;

const User = styled.li<StyledUserProps>`
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
