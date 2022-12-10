import styled from 'styled-components';
import { HistoryType, RANK } from '@type/common';
import { colors } from '@styles/theme';
import { MONTH_LABEL_MAPPING } from '@utils/constants';
import { getDate } from '@utils/utils';

const COMMIT_LEFT_BOUNDARY = 5;

const COMMIT_RIGHT_BOUNDARY = 48;

interface CommitHistoryProps {
  history: HistoryType;
  tier: RANK;
}
interface StyledTooltipProps {
  weeks: number;
}

function CommitHistory({ history, tier }: CommitHistoryProps) {
  const historyBlocks = Object.entries(history.contributionHistory);
  const firstBlockDate = historyBlocks[0][0];
  const firstDay = new Date(firstBlockDate).getDay();

  let prevMonth = -1;
  return (
    <Container>
      <CommitHistoryGroup>
        {Array.from({ length: firstDay }).map((_, idx) => (
          <CommitHistoryBlockDummy key={idx} />
        ))}
        {historyBlocks.map(([dateString, { level, count }], idx) => {
          const weeks = (idx + firstDay) / 7;
          const { month, date, day } = getDate(dateString);
          let isMonthLabelChange = false;
          if (prevMonth !== month && day === 0) {
            isMonthLabelChange = true;
            prevMonth = month;
          }
          return (
            <CommitHistoryBlock
              key={dateString}
              style={{ backgroundColor: level === 0 ? colors.commit0 : colors[`${tier}${level}`] }}
            >
              {date < 24 && day === 0 && isMonthLabelChange ? (
                <MonthLabel>{MONTH_LABEL_MAPPING[month]}</MonthLabel>
              ) : null}
              <ToolTip className='tooltip' weeks={weeks}>
                <strong>{count || 'No'}</strong> contribution on <strong>{dateString}</strong>
              </ToolTip>
            </CommitHistoryBlock>
          );
        })}
      </CommitHistoryGroup>
      <DayLabel>
        <li>Mon</li>
        <li>Wed</li>
        <li>Fri</li>
      </DayLabel>
    </Container>
  );
}

export default CommitHistory;

const Container = styled.div`
  position: relative;
  ${({ theme }) => theme.common.flexCenterColumn};
  width: 100%;
  padding-top: 20px;
  padding-left: 25px;
`;

const CommitHistoryGroup = styled.ul`
  position: relative;
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  grid-auto-flow: column;
  gap: 7px;
  width: 100%;
`;

const CommitHistoryBlock = styled.li`
  width: 16px;
  aspect-ratio: 1;
  position: relative;
  border-radius: 2px;
  &:hover .tooltip {
    display: block;
  }
`;

const CommitHistoryBlockDummy = styled.div`
  width: 16px;
  aspect-ratio: 1;
  background-color: transparent;
`;

const ToolTip = styled.div<StyledTooltipProps>`
  width: max-content;
  padding: 7px 10px;
  border-radius: 4px;
  position: absolute;
  ${({ weeks }) => {
    if (weeks < COMMIT_LEFT_BOUNDARY) {
      return `
        left: -20px;
      `;
    } else if (weeks >= COMMIT_LEFT_BOUNDARY && weeks < COMMIT_RIGHT_BOUNDARY) {
      return `
        left: 50%;
        transform: translateX(-50%);
      `;
    } else {
      return `
        right: -20px;
      `;
    }
  }}

  bottom: calc(100% + 5px);
  display: none;
  z-index: 1;
  background-color: ${({ theme }) => theme.colors.gray7};

  strong {
    font-weight: 700;
  }

  ::after {
    content: '';
    width: 10px;
    height: 10px;
    background-color: inherit;
    position: absolute;
    top: 75%;
    transform: rotate(45deg);
    ${({ weeks }) => {
      if (weeks < COMMIT_LEFT_BOUNDARY) {
        return `
        left: 23px;
      `;
      } else if (weeks >= COMMIT_LEFT_BOUNDARY && weeks < COMMIT_RIGHT_BOUNDARY) {
        return `
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
      `;
      } else {
        return `
        right: 23px;
      `;
      }
    }}
  }
`;

const MonthLabel = styled.div`
  position: absolute;
  font-size: 16px;
  bottom: 200%;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
`;

const DayLabel = styled.ul`
  position: absolute;
  top: 0;
  left: -20px;
  font-size: 16px;
  height: 100%;
  ${({ theme }) => theme.common.flexCenterColumn};
  align-items: flex-end;
  gap: 30px;
`;
