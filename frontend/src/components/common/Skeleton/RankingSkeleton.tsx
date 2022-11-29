import styled, { keyframes } from 'styled-components';

function RankingSkeleton() {
  return (
    <Container>
      <IndexSkeleton />
      <ProfileSkeleton />
      <TextSkeleton />
    </Container>
  );
}

export default RankingSkeleton;

const loading = keyframes`
    0% {
        opacity:1;
    }
    50% {
        opacity:0.3;
    }
    100% {
        opacity:1;
    }
`;

const Container = styled.div`
  ${({ theme }) => theme.common.flexSpaceBetween};
  background-color: ${({ theme }) => theme.colors.black4};
  border-radius: 8px;
  padding: 0px 20px;
  width: 100%;
  height: 76px;
  gap: 20px;

  & + & {
    margin-top: 5px;
  }

  section {
    background-color: ${({ theme }) => theme.colors.black1};
    animation: ${loading} 2.5s infinite;
    overflow: hidden;
  }
`;

const IndexSkeleton = styled.section`
  width: 26px;
  height: 26px;
  border-radius: 8px;
`;

const ProfileSkeleton = styled.section`
  width: 58px;
  height: 58px;
  border-radius: 50%;
`;

const TextSkeleton = styled.section`
  flex: 1;
  height: 26px;
  border-radius: 8px;
`;
