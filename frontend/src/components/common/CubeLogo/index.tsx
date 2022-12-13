import Image from 'next/image';
import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { CubeRankType } from '@type/common';
import { CUBE_COLOR_MAP } from '@utils/constants';

type sizeType = 'sm' | 'lg';
interface CubeLogoProps {
  size: sizeType;
  tier: CubeRankType;
  isInvalid?: boolean;
}

interface StyledSVGProps {
  tier: CubeRankType;
}

interface StyledShadowProps {
  size: sizeType;
}

const SIZE_MAP: {
  [key in sizeType]: {
    width: number;
    height: number;
    shadow: {
      width: number;
      height: number;
    };
  };
} = {
  lg: {
    width: 630,
    height: 232,
    shadow: {
      width: 185,
      height: 30,
    },
  },
  sm: {
    width: 420,
    height: 155,
    shadow: {
      width: 128,
      height: 21,
    },
  },
};

const CUBE_PATH_LIST = [
  'M363.989 36.9978L336.047 52.3652L369.211 68.0242L367.119 101.917L394.375 85.7092L396.961 52.0263L397 52.003L363.989 36.9978Z',
  'M326.944 48.0722L354.473 32.78L356.911 33.7831L323.324 18.5198L295.347 33.1544L326.944 48.0722Z',
  'M285.324 28.4199L313.685 14.1347L283.316 0.331055L254.885 14.6291L255.527 14.3496L285.324 28.4199Z',
  'M275.919 33.154L246.069 19.0637L217.61 33.376L246.742 47.8459L275.919 33.154Z',
  'M206.683 68.0243L237.183 52.6606L207.991 38.2122L176.45 54.0757L176.405 54.0488L177.87 87.4594L207.575 103.421L206.683 68.0243Z',
  'M207.767 110.937L178.194 94.8333L179.635 127.778L208.601 144.107L207.767 110.937Z',
  'M208.847 153.78L180.062 137.612L181.419 168.562L210.948 185.856L209.628 184.98L208.847 153.78Z',
  'M219.303 190.75L249.21 208.264V176.459L218.738 159.344L219.303 190.75Z',
  'M257.741 181.253L257.632 213.202L288.788 231.45L317.869 212.457L318.869 181.169L290.05 199.404L257.741 181.253Z',
  'M325.435 207.515L354.083 188.809L355.648 157.89L326.896 176.089L325.435 207.515Z',
  'M362.065 183.601L388.158 166.562L390.521 135.824L363.98 152.621L362.065 183.601Z',
  'M364.587 142.848L390.689 126.501L393.779 93.4236L366.628 109.733L364.587 142.848Z',
  'M327.349 166.166L356.138 148.137L357.812 115.031L328.916 132.394L327.349 166.166Z',
  'M297.978 73.3025L330.894 89.6549L329.284 124.405L358.209 107.213L359.947 72.8329L327.064 57.3064L297.978 73.3025Z',
  'M257.269 53.075L289.295 68.9867L318.014 53.0282L286.135 37.9763L257.269 53.075Z',
  'M247.907 57.968L217.205 74.0338L217.832 108.935L249.209 125.789V91.2565L280.278 73.9939L247.907 57.968Z',
  'M218.57 149.726L249.212 167V133.503L217.973 116.493L218.57 149.726Z',
  'M257.9 138.235L257.782 171.835L289.633 189.789L319.184 171.282L320.26 137.595L290.053 155.748L257.9 138.235Z',
  'M258.05 95.2628L257.925 130.472L290.049 147.733L320.512 129.625L321.629 94.4603L288.931 78.2781L258.05 95.2628Z',
];

function CubeLogo({ size, tier, isInvalid = false }: CubeLogoProps) {
  return (
    <Container>
      <Shadow size={size} />
      {isInvalid ? (
        <InvalidSvg
          src='/icons/cube/cube-small-invalid.svg'
          alt='큐브 이미지'
          width={160}
          height={160}
          quality={100}
          priority
        />
      ) : (
        <Svg
          width={SIZE_MAP[size].width}
          height={SIZE_MAP[size].height}
          viewBox='0 0 574 232'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          {CUBE_PATH_LIST.map((d) => (
            <Path key={d} d={d} tier={tier} />
          ))}
        </Svg>
      )}
    </Container>
  );
}

export default CubeLogo;

const color = keyframes`
  0% {
    fill: ${CUBE_COLOR_MAP['red']};
  }
  14% {
    fill: ${CUBE_COLOR_MAP['orange']};
  }
  28% {
    fill: ${CUBE_COLOR_MAP['purple']};
  }
  42% {
    fill: ${CUBE_COLOR_MAP['blue']};
  }
  56% {
    fill: ${CUBE_COLOR_MAP['mint']};
  }
  70% {
    fill: ${CUBE_COLOR_MAP['green']};
  }
  84%{
    fill: ${CUBE_COLOR_MAP['yellow']};
  }
  100% {
    fill: ${CUBE_COLOR_MAP['red']};
  }
`;

const floating = keyframes`
  0%{
    transform: translateY(0);
  }
  50%{
    transform: translateY(-7%);
  }
  100%{
    transform: translateY(0);
  }
`;

const shadow = keyframes`
  0%{
    transform: translateX(-50%) scale(1);
  }
  50%{
    transform: translateX(-50%) scale(0.8);
  }
  100%{
    transform: translateX(-50%) scale(1);
  }
`;
const Container = styled.div`
  position: relative;
`;

const Shadow = styled.div<StyledShadowProps>`
  position: absolute;
  bottom: -8.5%;
  left: 50%;
  ${({ size }) => css`
    width: ${SIZE_MAP[size].shadow.width}px;
    height: ${SIZE_MAP[size].shadow.height}px;
  `}
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.black4};
  filter: blur(3px);
  animation: ${shadow} 4s cubic-bezier(0.28, 0, 0.44, 0.99) infinite;
`;

const Svg = styled.svg`
  animation: ${floating} 4s cubic-bezier(0.28, 0, 0.44, 0.99) infinite;
`;

const InvalidSvg = styled(Image)`
  z-index: 1;
  animation: ${floating} 4s cubic-bezier(0.28, 0, 0.44, 0.99) infinite;
`;

const Path = styled.path<StyledSVGProps>`
  fill: ${({ tier }) => tier !== 'all' && CUBE_COLOR_MAP[tier]};
  ${({ tier }) =>
    tier === 'all' &&
    css`
      animation: ${color} 80s linear infinite;
    `};
`;
