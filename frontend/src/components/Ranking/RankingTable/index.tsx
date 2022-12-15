import { Children } from 'react';
import styled, { css } from 'styled-components';

type TextAlignType = 'center' | 'right' | 'left';

interface HeadProps {
  children?: React.ReactNode;
}

interface RowProps {
  children?: React.ReactNode;
  onClick?: () => void;
}

interface ElementProps {
  children?: React.ReactNode;
}

interface RankingProps {
  /** 테이블의 가로 크기 */
  width: string;
  /** 각 컬럼의 width 비율(%) 배열 */
  columnWidthList: string[];
  /** 각 컬럼의 수직 정렬 상태(left | center | right) 배열  */
  columnAlignList: TextAlignType[];
  /** 랭킹 테이블 헤드, 바디 */
  children?: React.ReactNode;
}

interface StyledContainer {
  tdWidthList: string[];
  tdAlignList: TextAlignType[];
}

interface StyledRow {
  isHover: boolean;
}

/**
 * Head 컴포넌트는 Ranking 컴포넌트의 자식 컴포넌트로 사용되어야 하고 Row 컴포넌트보다 먼저 사용되어야 합니다.
 */
function Head({ children }: HeadProps) {
  return (
    <thead>
      <tr>{children}</tr>
    </thead>
  );
}

/**
 * Row 컴포넌트는 Ranking 컴포넌트의 자식 컴포넌트로 사용되어야 합니다.
 */
function Row({ children, onClick }: RowProps) {
  const isHover = !!onClick;
  return (
    <Tr onClick={onClick} isHover={isHover}>
      {children}
    </Tr>
  );
}

/**
 * Element 컴포넌트는 Row 컴포넌트의 자식 컴포넌트로 사용되어야 합니다.
 */
function Element({ children }: ElementProps) {
  return <td>{children}</td>;
}

/**
 * Ranking 컴포넌트는 Row와 Element 컴포넌트를 자식 컴포넌트로 가져야합니다.
 */
function RankingTable({ width, columnWidthList, columnAlignList, children }: RankingProps) {
  const doms = Children.toArray(children);
  return (
    <Container width={width} tdWidthList={columnWidthList} tdAlignList={columnAlignList}>
      {doms[0]}
      <tbody>{doms.slice(1)}</tbody>
    </Container>
  );
}

RankingTable.Head = Head;
RankingTable.Row = Row;
RankingTable.Element = Element;

export default RankingTable;

const Container = styled.table<StyledContainer>`
  border-collapse: separate;
  border-spacing: 0 0.5em;

  tbody,
  thead {
    ${(props) => `
      ${props.tdWidthList.map(
        (width, idx) => `
        td:nth-child(${idx + 1}) {
          width: ${width};
        }  
      `,
      )}
    `}
    ${(props) => `
      ${props.tdAlignList.map(
        (textAlign, idx) => `
        td:nth-child(${idx + 1}) {
          text-align: -webkit-${textAlign};
        }  
      `,
      )}
    `}
  }

  thead {
    margin-bottom: 10px;
    height: 56px;
    tr {
      background-color: ${(props) => props.theme.colors.black5};
      td {
        line-height: 56px;
        color: ${(props) => props.theme.colors.gray6};
        font-size: ${(props) => props.theme.fontSize.md};

        &:last-of-type {
          padding-right: 20px;
        }
      }
    }
  }
`;

const Tr = styled.tr<StyledRow>`
  padding: 0 15px;
  background-color: ${(props) => props.theme.colors.black3};
  transition: background-color 0.1s ease-in-out;
  td {
    vertical-align: middle;
    height: 76px;
    font-size: ${(props) => props.theme.fontSize.lg};

    &:first-of-type {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }

    &:last-of-type {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
      padding-right: 20px;
    }
  }
  ${(props) =>
    props.isHover &&
    css`
      cursor: pointer;
      &:hover {
        background-color: ${(props) => props.theme.colors.gray1};
      }
    `}
`;
