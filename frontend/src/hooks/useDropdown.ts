import { useState,useEffect } from 'react';

function useDropdown() {
    const [isOpen, setIsOpen] = useState(false);

    const closeDropdown = () => setIsOpen(false);

    const toggleDropdown = () => setIsOpen(!isOpen);
    
    return { isOpen, toggleDropdown, closeDropdown }
};

export default useDropdown;