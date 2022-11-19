import Image from 'next/image';
import styled, { css } from 'styled-components';
import { ClickEvent } from '@types';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  src: string;
  size?: AvatarSize;
  name?: string;
  onClick?: (e: ClickEvent) => void;
}

interface StyledContainerProps {
  size: AvatarSize;
}

function Avatar({ src, size = 'md', name, onClick }: AvatarProps) {
  return (
    <Container>
      <ImageContainer size={size} onClick={onClick}>
        <Image src={src} alt='프로필 이미지' fill />
        {name}
      </ImageContainer>
      {name}
    </Container>
  );
}

export default Avatar;

const Container = styled.div`
  width: max-content;
  ${({ theme }) => theme.common.flexCenter};
  gap: 12px;
  font-size: ${({ theme }) => theme.fontSize.lg};
  padding-right: 12px;
`;

const ImageContainer = styled.div<StyledContainerProps>`
  ${({ theme }) => theme.common.flexCenter};
  border-radius: 50%;
  width: 58px;
  height: 58px;
  cursor: pointer;
  overflow: hidden;

  position: relative;

  ${(props) =>
    props.size === 'sm' &&
    css`
      width: 30px;
      height: 30px;
    `}

  ${(props) =>
    props.size === 'lg' &&
    css`
      width: 250px;
      height: 250px;
    `}
`;
