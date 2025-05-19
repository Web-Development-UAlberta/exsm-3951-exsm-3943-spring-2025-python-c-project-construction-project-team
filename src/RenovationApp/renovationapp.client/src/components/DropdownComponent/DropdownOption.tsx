import React, { useRef, useEffect } from 'react';

interface Options {
    value: string
    id?: string;
}

export interface DropDownOptionProps {
    value: Options
    onClick?: any;
    isSelected?: boolean;
    className?: string;
}

export const DropDownOption: React.FC<DropDownOptionProps> = ({
    value,
    onClick,
    isSelected = false,
    className = '',
    ...rest
}) => {
    const ref = useRef<HTMLLIElement>(null);

    useEffect(() => {
        if (isSelected) {
            ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [isSelected]);

    const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
        if (onClick) {
            onClick(event, value.value);
        }
    };

    return (
        <li
            ref={ref}
            id={value.id}
            onClick={handleClick}
            className={`${className || 'dropdown-item'} ${isSelected ? 'active' : ''}`}
            {...rest}
        >
            {value.value}
        </li>
    );
}
