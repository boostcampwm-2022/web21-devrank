import styled from 'styled-components';
import { ProfileLabel } from '@components/Profile';
import { Avatar, CubeIcon, Paper } from '@components/common';

function ProfileCard() {
  return (
    <Paper>
      <Avatar src='/profile-dummy.png' size='lg' />
      <ProfileInfos>
        <li>
          <h3>wkddntjr1123</h3>
        </li>
        <ProfileLabel>
          <ProfileLabel.Icon src='/icons/username.svg' />
          <ProfileLabel.Contents>장우석</ProfileLabel.Contents>
        </ProfileLabel>
        <ProfileLabel>
          <ProfileLabel.Icon src='/icons/location.svg' />
          <ProfileLabel.Contents>Ganwondo, Korea</ProfileLabel.Contents>
        </ProfileLabel>
        <ProfileLabel>
          <ProfileLabel.Icon src='/icons/people.svg' />
          <ProfileLabel.Contents>19 followers - 21 following</ProfileLabel.Contents>
        </ProfileLabel>
        <ProfileLabel>
          <ProfileLabel.Icon src='/icons/company.svg' />
          <ProfileLabel.Contents>naver</ProfileLabel.Contents>
        </ProfileLabel>
        <ProfileLabel>
          <ProfileLabel.Icon src='/icons/link.svg' />
          <ProfileLabel.Contents>https://wkddntjr1123.github.io</ProfileLabel.Contents>
        </ProfileLabel>
        <ProfileLabel>
          <ProfileLabel.Icon src='/icons/organization.svg' />
          <ProfileLabel.Contents>부스트캠프</ProfileLabel.Contents>
        </ProfileLabel>
      </ProfileInfos>
      <ProfileRank>
        <CubeIcon tier='mint' size={160} />
        <p>전체: 1000등</p>
        <p>레드: 10등</p>
      </ProfileRank>
    </Paper>
  );
}

export default ProfileCard;

const ProfileInfos = styled.ul`
  ${({ theme }) => theme.common.flexColumn};
  flex: 1;
  margin-left: 30px;

  h3 {
    font-size: ${({ theme }) => theme.fontSize.xxl};
    font-weight: ${({ theme }) => theme.fontWeight.bold};
  }

  > li + li {
    margin-top: 4px;
  }
`;

const ProfileRank = styled.div`
  ${({ theme }) => theme.common.flexCenterColumn};
  max-width: 300px;
  width: 100%;

  p {
    margin-top: 8px;
  }

  transform: translateZ(-50);
`;
