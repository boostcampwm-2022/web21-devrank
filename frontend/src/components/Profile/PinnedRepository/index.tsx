import Image from 'next/image';
import styled from 'styled-components';
import { LanguageIcon } from '@components/common';
import { numberCompactFormatter } from '@utils/utils';

interface RepositoryResponse {
  name: string;
  description: string;
  languages: string[];
  forks: number;
  stars: number;
}

interface PinnedRepositoryProps {
  repositories: RepositoryResponse[];
}

function PinnedRepository({ repositories }: PinnedRepositoryProps) {
  return (
    <Container>
      {repositories.map(({ name, description, languages, forks, stars }) => (
        <Repository key={`${name}-${description}`}>
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
                {numberCompactFormatter(stars)}
              </li>
              <li>
                <Image src={'/icons/fork.svg'} alt='star' width={24} height={24} />
                {numberCompactFormatter(forks)}
              </li>
            </Info>
          </Meta>
        </Repository>
      ))}
    </Container>
  );
}

export default PinnedRepository;

const Container = styled.section`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  gap: 30px;
  width: 100%;
  height: 580px;
`;

const Repository = styled.section`
  background-color: ${({ theme }) => theme.colors.black1};
  border-radius: 8px;
  width: 100%;
  padding: 20px 30px;
`;

const Name = styled.h4`
  font-size: ${({ theme }) => theme.fontSize.lg};
  height: 50px;
`;

const Description = styled.p`
  height: 40px;
`;

const Meta = styled.div`
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
