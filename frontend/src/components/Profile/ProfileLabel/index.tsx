import Image from 'next/image';
import styled from 'styled-components';

interface IconProps {
  src: string;
}

interface ContentsProps {
  children: React.ReactNode;
}

interface ProfileLabelProps {
  children: React.ReactNode;
}

function Icon({ src }: IconProps) {
  return (
    <li>
      <Image src={src} alt='라벨아이콘' width={24} height={24} />
    </li>
  );
}

function Contents({ children }: ContentsProps) {
  return <LabelContents>{children}</LabelContents>;
}

function ProfileLabel({ children }: ProfileLabelProps) {
  return (
    <li>
      <Container>{children}</Container>
    </li>
  );
}

ProfileLabel.Icon = Icon;
ProfileLabel.Contents = Contents;

export default ProfileLabel;

const Container = styled.ul`
  ${({ theme }) => theme.common.flexRow};
  align-items: center;
`;

const LabelContents = styled.li`
  margin-left: 10px;
`;
