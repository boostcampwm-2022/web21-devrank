import styled from 'styled-components';
import { ClickEvent } from '@type/common';

type ArrowType = 'left' | 'right' | 'doubleLeft' | 'doubleRight';

interface ArrowProps {
  active: boolean;
  direction: ArrowType;
  onClick?: (e: unknown) => void;
}

interface StyledArrowProps {
  active: boolean;
}

function Arrow({ active, direction, onClick }: ArrowProps) {
  const color = active ? '#FBFBFB' : '#505050';

  const onClickArrow = (e: ClickEvent) => {
    if (!active) return;
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Container onClick={onClickArrow} active={active}>
      <svg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'>
        {direction === 'doubleLeft' ? (
          <g>
            <path
              d='M19.8942 8.40376L18.3621 6.8717L12.2339 13L18.3621 19.1282L19.8942 17.5961L15.298 13L19.8942 8.40376Z'
              fill={color}
            />
            <path
              d='M12.234 6.8717L13.766 8.40376L9.16983 13L13.766 17.5961L12.234 19.1282L6.10571 13L12.234 6.8717Z'
              fill={color}
            />
          </g>
        ) : direction === 'doubleRight' ? (
          <g>
            <path
              d='M6.10571 8.40376L7.63777 6.8717L13.766 13L7.63781 19.1282L6.10574 17.5961L10.7019 13L6.10571 8.40376Z'
              fill={color}
            />
            <path
              d='M13.766 6.8717L12.2339 8.40376L16.8302 13L12.2339 17.5961L13.7661 19.1282L19.8943 13L13.766 6.8717Z'
              fill={color}
            />
          </g>
        ) : direction === 'left' ? (
          <path
            d='M9.75 13L9.04289 12.2929L8.33579 13L9.04289 13.7071L9.75 13ZM15.5429 5.79289L9.04289 12.2929L10.4571 13.7071L16.9571 7.20711L15.5429 5.79289ZM9.04289 13.7071L15.5429 20.2071L16.9571 18.7929L10.4571 12.2929L9.04289 13.7071Z'
            fill={color}
          />
        ) : direction === 'right' ? (
          <path
            d='M16.25 13L16.9571 12.2929L17.6642 13L16.9571 13.7071L16.25 13ZM10.4571 5.79289L16.9571 12.2929L15.5429 13.7071L9.04289 7.20711L10.4571 5.79289ZM16.9571 13.7071L10.4571 20.2071L9.04289 18.7929L15.5429 12.2929L16.9571 13.7071Z'
            fill={color}
          />
        ) : null}
      </svg>
    </Container>
  );
}

export default Arrow;

const Container = styled.div<StyledArrowProps>`
  ${({ theme }) => theme.common.flexCenter};
  cursor: ${({ active }) => (active ? 'pointer' : 'not-allowed')};
  width: 32px;
  height: 32px;
`;
