import Image from 'next/image'
import styled, { css} from 'styled-components';
import { ClickEvent } from '@types';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
    src: string;
    size ?: AvatarSize;
    onClick ?: (e: ClickEvent) => void;
}

interface StyledContainerProps {
    size: AvatarSize;
}

function Avatar({src, size = 'md', onClick }:AvatarProps) {
  return (
      <Container size={size} onClick={onClick}><Image src={src} alt="프로필 이미지" fill/></Container>
  )
}

export default Avatar;

const Container = styled.div<StyledContainerProps>`
    ${({theme}) =>theme.common.flexCenter};
    border-radius:50%;
    width:58px;
    height:58px;
    cursor:pointer;

    position:relative;

    ${(props) => props.size === 'sm' && css`
        width:30px;
        height:30px;
    `}

    ${(props) => props.size === 'lg' && css`
        width:250px;
        height:250px;
    `}
`;