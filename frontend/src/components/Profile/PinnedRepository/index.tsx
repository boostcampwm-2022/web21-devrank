import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';
import { PinnedRepositoryType } from '@type/common';
import { LanguageIcon } from '@components/common';
import { numberCompactFormatter } from '@utils/utils';

interface PinnedRepositoryProps {
  repositories: PinnedRepositoryType[];
}

function PinnedRepository({ repositories }: PinnedRepositoryProps) {
  return repositories.length === 0 ? (
    <NotExist>There are no pinned repositories</NotExist>
  ) : (
    <Container>
      {repositories.map(({ name, description, languages, forkCount, stargazerCount, url }) => (
        <Link href={url} key={`${name}-${description}`}>
          <Repository>
            <Name>{name}</Name>
            <Description>{description}</Description>
            <Meta>
              <Languages>
                {languages.map((language) => (
                  <li key={language}>
                    <LanguageIcon language={language} width={37} height={37} />
                  </li>
                ))}
              </Languages>
              <Info>
                <li>
                  <Image src={'/icons/star.svg'} alt='star' width={24} height={24} />
                  {numberCompactFormatter(stargazerCount)}
                </li>
                <li>
                  <Image src={'/icons/fork.svg'} alt='star' width={24} height={24} />
                  {numberCompactFormatter(forkCount)}
                </li>
              </Info>
            </Meta>
          </Repository>
        </Link>
      ))}
    </Container>
  );
}

export default PinnedRepository;

const Container = styled.section`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  gap: 30px;
  width: 100%;
`;

const Repository = styled.section`
  background-color: ${({ theme }) => theme.colors.black1};
  border-radius: 8px;
  width: 100%;
  padding: 20px 30px;
`;

const NotExist = styled.p`
  width: 100%;
  height: 200px;
  ${({ theme }) => theme.common.flexCenter};
  font-size: 24px;
`;

const Name = styled.h4`
  width: 100%;
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSize.lg};
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Description = styled.p`
  width: 100%;
  height: 36px;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
`;

const Meta = styled.div`
  margin-top: 24px;
  ${({ theme }) => theme.common.flexSpaceBetween}
`;

const Languages = styled.ul`
  ${({ theme }) => theme.common.flexCenter}
  gap: 8px;
`;

const Info = styled.ul`
  ${({ theme }) => theme.common.flexCenter}
  gap: 16px;

  li {
    ${({ theme }) => theme.common.flexCenter}
    gap: 2px;
  }
`;
