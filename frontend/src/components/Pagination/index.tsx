import styled, { css } from 'styled-components';
import Arrow from './Arrow';

interface PaginationRange {
  left: number;
  right: number;
}

interface PaginationProps {
  currentPage: number;
  range: PaginationRange;
  firstPage: number;
  lastPage: number;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  setCurrentPage: (page: number) => void;
}

interface StyledPaginationItemProps {
  isCurrent: boolean;
}

function Pagination({
  currentPage,
  range,
  firstPage,
  lastPage,
  canMoveLeft,
  canMoveRight,
  setCurrentPage,
}: PaginationProps) {
  return (
    <PaginationList>
      <li>
        <Arrow direction='doubleLeft' active={canMoveLeft} onClick={() => setCurrentPage(firstPage)} />
      </li>
      <li>
        <Arrow direction='left' active={canMoveLeft} onClick={() => setCurrentPage(range.left - 1)} />
      </li>
      {Array.from({ length: range.right - range.left + 1 }, (_, i) => range.left + i).map((page, index) => (
        <PaginationItem key={index} isCurrent={page === currentPage} onClick={() => setCurrentPage(page)}>
          {page}
        </PaginationItem>
      ))}
      <li>
        <Arrow direction='right' active={canMoveRight} onClick={() => setCurrentPage(range.right + 1)} />
      </li>
      <li>
        <Arrow direction='doubleRight' active={canMoveRight} onClick={() => setCurrentPage(lastPage)} />
      </li>
    </PaginationList>
  );
}

export default Pagination;

const PaginationList = styled.ul`
  ${({ theme }) => theme.common.flexSpaceBetween};
`;

const PaginationItem = styled.li<StyledPaginationItemProps>`
  ${({ theme }) => theme.common.flexCenter};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  margin: 0 4px;
  line-height: 32px;
  cursor: pointer;

  ${(props) =>
    props.isCurrent &&
    css`
      background-color: ${({ theme }) => theme.colors.gray1};
    `}
`;
