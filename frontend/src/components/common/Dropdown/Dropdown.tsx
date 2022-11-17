import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

function Dropdown({ trigger, children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const onClickBackground = (e: MouseEvent) => {
    if (e.target instanceof HTMLElement) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('click', onClickBackground);
    return () => window.removeEventListener('click', onClickBackground);
  }, []);

  return (
    <Container ref={containerRef} onClick={() => setIsOpen((prev) => !prev)}>
      {trigger}
      {isOpen && <Options>{children}</Options>}
    </Container>
  );
}

export default Dropdown;

const Container = styled.div`
  position: relative;
`;
const Options = styled.ul`
  position: absolute;
  bottom: -25px;
  left: 50%;
  background-color: ${({ theme }) => theme.colors.black2};
  transform: translate(-50%, 100%);
  border: 2px solid ${({ theme }) => theme.colors.gray1};
  border-radius: 10px;
  padding: 0 5px;

  li {
    border-top: 1px solid ${({ theme }) => theme.colors.gray1};

    &:first-child {
      border: none;
    }
  }
`;
