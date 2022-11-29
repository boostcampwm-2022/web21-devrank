import React from 'react';

interface DropdownContextType {
  ref: React.RefObject<HTMLDivElement>;
  isOpen: boolean;
  toggleDropdown: () => void;
  closeDropdown: (e: MouseEvent) => void;
}

export const DropdownContext = React.createContext<DropdownContextType>({} as DropdownContextType);
