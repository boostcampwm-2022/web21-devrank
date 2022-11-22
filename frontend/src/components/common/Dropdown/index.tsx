import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ClickEvent } from '@type/common';

interface ItemProps {
  children: React.ReactNode;
  onClick?: (e: ClickEvent) => void;
}

interface DropdownProps {
  /** 드롭다운을 동작시킬 컴포넌트를 지정한다. */
  trigger: React.ReactNode;
  children: React.ReactNode;
}

function Item({ children, onClick }: ItemProps) {
  return <ItemContainer onClick={onClick}>{children}</ItemContainer>;
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

Dropdown.Item = Item;

export default Dropdown;

const Container = styled.div`
  position: relative;
  width: max-content;
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

  z-index: 10;

  li {
    border-top: 1px solid ${({ theme }) => theme.colors.gray1};

    &:first-child {
      border: none;
    }
  }
`;

const ItemContainer = styled.li`
  ${({ theme }) => theme.common.flexCenter};
  gap: 5px;
  width: max-content;
  min-width: 95px;
  height: 35px;
  padding: 25px 10px;
  cursor: pointer;
`;
