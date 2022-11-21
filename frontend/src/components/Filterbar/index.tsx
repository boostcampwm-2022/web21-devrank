import styled, { css } from 'styled-components';
import { CubeRankType } from '@type/common';
import { CubeIcon } from '@components/common';
import { CUBE_RANK } from '@utils/constants';

interface FilterbarProps {
  active: CubeRankType;
  setActive: (active: CubeRankType) => void;
}

interface StyledFilterItemProps {
  active: boolean;
}

function Filterbar({ active, setActive }: FilterbarProps) {
  return (
    <Container>
      {Object.entries(CUBE_RANK).map(([k, tier]) => (
        <FilterItem key={k} active={active === tier} onClick={() => setActive(tier)}>
          <CubeIcon tier={tier} />
          <Label>{tier}</Label>
        </FilterItem>
      ))}
    </Container>
  );
}

export default Filterbar;

const Container = styled.ul`
  ${({ theme }) => theme.common.flexRow};
  background-color: ${({ theme }) => theme.colors.black3};
  border-radius: 4px;
  width: fit-content;
  overflow: hidden;

  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));

  li + li {
    border-left: 1px solid ${({ theme }) => theme.colors.black1};
  }
`;

const FilterItem = styled.li<StyledFilterItemProps>`
  ${({ theme }) => theme.common.flexCenter};
  width: 130px;
  padding: 15px 0px;

  cursor: pointer;

  ${(props) =>
    props.active &&
    css`
      background-color: ${({ theme }) => theme.colors.gray1};
    `}
`;

const Label = styled.span`
  ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  margin-left: 8px;
`;
