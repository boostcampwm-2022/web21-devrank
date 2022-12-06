import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import styled from 'styled-components';
import ProfileRefreshButton from '../ProfileRefreshButton';
import { CubeRankType, OrganizationType } from '@type/common';
import { ProfileLabel } from '@components/Profile';
import { Avatar, CubeIcon, Paper } from '@components/common';

interface ProfileCardProps {
  profileData: {
    username: string;
    name: string;
    location: string;
    followers: number;
    following: number;
    company: string;
    email: string;
    avatarUrl: string;
    organizations: OrganizationType[];
    tier: CubeRankType;
    tierRank: number;
    totalRank: number;
    updateDelayTime: number;
    updateData: () => void;
    isLoading: boolean;
  };
}

function ProfileCard({ profileData }: ProfileCardProps) {
  const {
    username,
    name,
    location,
    followers,
    following,
    company,
    email,
    organizations,
    avatarUrl,
    tier,
    tierRank,
    totalRank,
    updateDelayTime,
    updateData,
    isLoading,
  } = profileData;

  const { t } = useTranslation('profile');

  const gotoGithub = (username: string) => {
    window.location.href = `https://github.com/${username}`;
  };
  return (
    <Paper>
      <Avatar src={avatarUrl} size='lg' onClick={() => gotoGithub(username)} />
      <ProfileInfos>
        <li>
          <h3 onClick={() => gotoGithub(username)}>{username}</h3>
          <ProfileRefreshButton updateData={updateData} updateDelayTime={updateDelayTime} isLoading={isLoading} />
        </li>
        {name && (
          <ProfileLabel>
            <ProfileLabel.Icon src='/icons/username.svg' />
            <ProfileLabel.Contents>{name}</ProfileLabel.Contents>
          </ProfileLabel>
        )}
        {location && (
          <ProfileLabel>
            <ProfileLabel.Icon src='/icons/location.svg' />
            <ProfileLabel.Contents>{location}</ProfileLabel.Contents>
          </ProfileLabel>
        )}
        <ProfileLabel>
          <ProfileLabel.Icon src='/icons/people.svg' />
          <ProfileLabel.Contents>
            {followers || 0} followers - {following || 0} following
          </ProfileLabel.Contents>
        </ProfileLabel>
        {company && (
          <ProfileLabel>
            <ProfileLabel.Icon src='/icons/company.svg' />
            <ProfileLabel.Contents>{company}</ProfileLabel.Contents>
          </ProfileLabel>
        )}
        {email && (
          <ProfileLabel>
            <ProfileLabel.Icon src='/icons/link.svg' />
            <ProfileLabel.Contents>{email}</ProfileLabel.Contents>
          </ProfileLabel>
        )}
        {organizations && organizations.length > 0 && (
          <ProfileLabel>
            <ProfileLabel.Icon src='/icons/organization.svg' />
            <ProfileLabel.Contents>
              {organizations?.map(({ avatarUrl, name, url }) => (
                <a key={name} href={url}>
                  <Image src={avatarUrl} width={27} height={27} alt={name} quality={100} style={ImageStyle} />
                </a>
              ))}
            </ProfileLabel.Contents>
          </ProfileLabel>
        )}
      </ProfileInfos>
      <ProfileRank>
        <CubeIcon tier={tier} size={160} />
        <p>
          {t('total')}: {totalRank}등
        </p>
        <p>
          {tier}: {tierRank}등
        </p>
      </ProfileRank>
    </Paper>
  );
}

export default ProfileCard;

const ProfileInfos = styled.ul`
  width: 100%;
  height: 220px;
  margin-left: 30px;

  h3 {
    width: max-content;
    cursor: pointer;
    font-size: ${({ theme }) => theme.fontSize.xxl};
    font-weight: ${({ theme }) => theme.fontWeight.bold};
  }

  > li {
    display: flex;
    align-items: center;
    gap: 20px;

    &:first-child {
      margin-bottom: 10px;
    }

    + li {
      margin-top: 4px;
    }
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

const ImageStyle = {
  borderRadius: 5,
  marginRight: 5,
};
