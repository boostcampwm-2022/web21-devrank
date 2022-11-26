import Image from 'next/image';
import styled, { css } from 'styled-components';
import { ClickEvent } from '@type/common';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  /** 유저 프로필 사진 경로 */
  src: string;
  /** 아바타 가로 세로 크기 */
  size?: AvatarSize;
  /** 사용자명 */
  name?: string;
  /** 아바타 클릭시 실행되는 함수 */
  onClick?: (e: ClickEvent) => void;
}

interface StyledContainerProps {
  size: AvatarSize;
}

function Avatar({ src, size = 'md', name, onClick }: AvatarProps) {
  return (
    <Container>
      <ImageContainer size={size} onClick={onClick}>
        <Image src={src} alt='프로필 이미지' sizes='50vw' fill />
      </ImageContainer>
      {name && <span>{name}</span>}
    </Container>
  );
}

export default Avatar;

const Container = styled.div`
  ${({ theme }) => theme.common.flexCenter};
  font-size: ${({ theme }) => theme.fontSize.lg};
  width: max-content;
  gap: 12px;
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
