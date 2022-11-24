import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ClickEvent } from '@type/common';
import { DropdownContext } from '@contexts/dropdown';
import useDropdown from '@hooks/useDropdown';

interface DropdownProps {
  children: React.ReactNode;
  onClick?: (e: ClickEvent) => void;
}

function Dropdown({ children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const ref = React.useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const closeDropdown = (e: MouseEvent) => {
    if (e.target instanceof HTMLElement) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('click', closeDropdown);
    return () => window.removeEventListener('click', closeDropdown);
  }, []);

  return (
    <DropdownContext.Provider value={{ ref, isOpen, toggleDropdown, closeDropdown }}>
      <Container>{children}</Container>
    </DropdownContext.Provider>
  );
}

function Trigger({ children }: DropdownProps) {
  const { toggleDropdown, ref } = useDropdown();
  return (
    <div ref={ref} onClick={toggleDropdown}>
      {children}
    </div>
  );
}

function ItemList({ children }: DropdownProps) {
  const { isOpen } = useDropdown();

  return isOpen ? <DropdownList>{children}</DropdownList> : null;
}

function Item({ children, onClick }: DropdownProps) {
  return <DropdownItem onClick={onClick}>{children}</DropdownItem>;
}

Dropdown.ItemList = ItemList;
Dropdown.Trigger = Trigger;
Dropdown.Item = Item;

export default Dropdown;

const Container = styled.div`
  position: relative;
  width: max-content;
`;
const DropdownList = styled.ul`
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

const DropdownItem = styled.li`
  ${({ theme }) => theme.common.flexCenter};
  gap: 5px;
  width: max-content;
  min-width: 95px;
  height: 35px;
  padding: 25px 10px;
  cursor: pointer;
`;
