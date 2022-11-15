import styled from 'styled-components';
import type { LayoutProps } from '@types';
import Footer from '@components/Footer';

function Layout({ children }: LayoutProps) {
  return (
    <Container>
      <Main>{children}</Main>
      <Footer />
    </Container>
  );
}

export default Layout;

const Container = styled.div`
  min-width: 1200px;
  width: 100%;
  height: 100vh;
`;

const Main = styled.main`
  width: 100%;
  height: calc(100vh - ${({ theme }) => `(${theme.component.headerHeight} + ${theme.component.footerHeight})`});
`;
