import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import ProfileRefreshButton from '../ProfileRefreshButton';
import { OrganizationType, RANK } from '@type/common';
import { ProfileLabel } from '@components/Profile';
import { Avatar, Paper } from '@components/common';
import CubeLogo from '@components/common/CubeLogo';
import { CUBE_COLOR_MAP } from '@utils/constants';
import { getRankingUnit } from '@utils/utils';

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
    tier: RANK;
    tierRank: number;
    totalRank: number;
    updateDelayTime: number;
    updateData: () => void;
    isLoading: boolean;
    isMine: boolean;
    isInvalid: boolean;
  };
}

interface StyledColorProps {
  color: string;
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
    isMine,
    isInvalid,
  } = profileData;

  const { t } = useTranslation(['profile', 'tier']);
  const router = useRouter();
  const locale = router.locale as string;

  const gotoGithub = (username: string) => {
    window.location.href = `https://github.com/${username}`;
  };
  return (
    <Paper>
      <Avatar src={avatarUrl} size='lg' onClick={() => gotoGithub(username)} />
      <ProfileInfos>
        <li>
          <h3 onClick={() => gotoGithub(username)}>{username}</h3>
          <ProfileRefreshButton
            updateData={updateData}
            updateDelayTime={updateDelayTime}
            isLoading={isLoading}
            isMine={isMine}
          />
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
                  <Image src={avatarUrl} width={27} height={27} alt={name} style={ImageStyle} />
                </a>
              ))}
            </ProfileLabel.Contents>
          </ProfileLabel>
        )}
      </ProfileInfos>
      <ProfileRank>
        <CubeLogo tier={tier} size={'sm'} isInvalid={isInvalid} />
        {isInvalid ? (
          <RankText>
            <p>{t('profile:invalid-rank')}</p>
          </RankText>
        ) : (
          <RankText>
            <p>
              {t('profile:total')}&nbsp;{totalRank}
              {getRankingUnit(locale, totalRank)}
            </p>
            <p>
              <ColorPoint color={CUBE_COLOR_MAP[tier]}>{t(`tier:${tier}`)}</ColorPoint>
              &nbsp;{tierRank}
              {getRankingUnit(locale, tierRank)}
            </p>
          </RankText>
        )}
      </ProfileRank>
    </Paper>
  );
}

export default ProfileCard;

const ColorPoint = styled.span<StyledColorProps>`
  color: ${({ color }) => color};
`;

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
  max-width: 300px;
  width: 100%;
  ${({ theme }) => theme.common.flexCenterColumn};
`;

const RankText = styled.div`
  margin-top: 20px;
  p {
    margin-top: 8px;
  }
`;

const ImageStyle = {
  borderRadius: 5,
  marginRight: 5,
};
