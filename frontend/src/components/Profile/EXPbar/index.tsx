import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import { RANK } from '@type/common';

interface EXPbarProps {
  /** exp 점수 **/
  tier: RANK;
  exp: number;
  needExp: number;
  startExp: number;
}

interface StyledActiveProps {
  percent: number;
  tier: RANK;
}

function EXPbar({ tier, exp, startExp, needExp }: EXPbarProps) {
  const { t } = useTranslation('profile');
  const max = needExp + exp;
  const min = startExp;
  const percent = ((exp - min) / (max - min)) * 100;
  return (
    <>
      <Score>{`${t('current-score')} : ${exp}`}</Score>
      <ProgressBar>
        <Active percent={percent} tier={tier} />
      </ProgressBar>
    </>
  );
}

export default EXPbar;

const Score = styled.div`
  font-size: 20px;
  margin-top: 10px;
  margin-left: 10px;
`;

const ProgressBar = styled.div`
  ${({ theme }) => theme.common.boxShadow};
  width: 100%;
  height: 38px;
  border-radius: 19px;
  margin-top: 20px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.text};
`;

const Active = styled.div<StyledActiveProps>`
  width: ${({ percent }) => percent}%;
  background: ${({ theme, tier }) =>
    `linear-gradient(90deg, ${theme.colors[`${tier}3`]} 0%, ${theme.colors[`${tier}1`]} 100%)`};
  height: 100%;
`;
