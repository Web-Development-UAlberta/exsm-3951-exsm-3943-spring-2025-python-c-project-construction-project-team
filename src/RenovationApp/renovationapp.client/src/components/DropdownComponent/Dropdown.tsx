import React, { useState, useRef, useEffect } from 'react';
import { DropDownOption } from './DropdownOption';

interface Options {
    value: string
    id?: string;
}

export interface DropDownProps {
    options: Options[];
    label?: string;
    initialValue?: string;
    onSelect?: (value: string) => void;
    className?: string;
}

export const Dropdown: React.FC<DropDownProps> = ({
    options,
    label = 'Select an option',
    initialValue = null,
    onSelect,
    className = '',
    ...rest
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | null>(initialValue);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (initialValue !== null) {
            setSelectedValue(initialValue);
        }
    }, [initialValue]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        setIsOpen(false);
        if (onSelect) {
            onSelect(value);
        }
    };

    const displayValue = selectedValue !== null ?
        options.find(option => option.value === selectedValue)?.value || selectedValue :
        label;

    return (
        <div className={`dropdown ${className}`} ref={dropdownRef} {...rest}>
            <button
                type="button"
                className="btn btn-secondary dropdown-toggle"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                {displayValue}
                <span className="caret" />
            </button>
            {isOpen && (
                <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                    {options.map((option, index) => (
                        <DropDownOption
                            key={option.id || index}
                            value={option}
                            onClick={handleSelect}
                            isSelected={selectedValue === option.value}
                            className="dropdown-item"
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}