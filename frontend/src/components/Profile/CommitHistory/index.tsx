import styled from 'styled-components';
import { MONTH_LIST } from '@utils/constants';

function CommitHistory() {
  return (
    <Container>
      <MonthList>
        {MONTH_LIST.map((month) => (
          <li key={month}>{month}</li>
        ))}
      </MonthList>
      <CommitHistoryGroup>
        {Array.from({ length: 371 }).map((_, idx) => (
          <CommitHistoryBlock key={idx} />
        ))}
      </CommitHistoryGroup>
    </Container>
  );
}

export default CommitHistory;

const Container = styled.div`
  ${({ theme }) => theme.common.flexCenterColumn};
  width: 100%;
  padding: 10px;
`;

const MonthList = styled.ul`
  ${({ theme }) => theme.common.flexSpaceBetween};
  justify-content: space-around;
  margin-bottom: 20px;
  width: 100%;
`;

const CommitHistoryGroup = styled.ul`
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  grid-auto-flow: column;
  gap: 7px;
  width: 100%;
`;

const CommitHistoryBlock = styled.li`
  background-color: ${({ theme }) => theme.colors.gray4};
  border-radius: 2px;
  aspect-ratio: 1;
`;
