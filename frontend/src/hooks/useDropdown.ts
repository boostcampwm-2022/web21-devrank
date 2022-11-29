import React from 'react';
import { DropdownContext } from '@contexts/dropdown';

function useDropdown() {
  const context = React.useContext(DropdownContext);
  if (context === undefined) {
    throw new Error('useToggle must be used within a <Toggle />');
  }
  return context;
}

export default useDropdown;
