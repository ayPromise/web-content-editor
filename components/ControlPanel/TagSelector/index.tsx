import { useTextSelection } from '@/context/TextSelectionContext';
import { ArrowDown01Icon } from '@/icons';
import React, { useState, useRef, useEffect } from 'react';


interface TagSelectorProps {
    value: 'P' | 'H1' | 'H2' | 'H3' | 'H4' | 'H5';
    onChange: (newValue: TagSelectorProps['value']) => void;
}

const options: TagSelectorProps['value'][] = [
    'P',
    'H1',
    'H2',
    'H3',
    'H4',
    'H5'
];

// Mapping the option values to display text
const displayText: Record<TagSelectorProps['value'], string> = {
    P: 'Paragraph',
    H1: 'Heading 1',
    H2: 'Heading 2',
    H3: 'Heading 3',
    H4: 'Heading 4',
    H5: 'Heading 5',
};

const TagSelector = ({ onChange }: { onChange: (newValue: TagSelectorProps['value']) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { selectedText } = useTextSelection()
    const tagName = selectedText?.mainElement.tagName

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative flex justify-center min-w-[130px] select-none">
            {/* Selected option */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="relative -my-2 py-2 pl-2 pr-7 rounded cursor-pointer bg-transparent hover:bg-yellow-500"
            >
                {displayText[tagName]}
                <span
                    className={`absolute right-0 transition-transform duration-100 ${isOpen ? 'rotate-180' : ''}`}
                >
                    <ArrowDown01Icon color="white" />
                </span>
            </div>

            {/* Custom dropdown */}
            {isOpen && (
                <ul className="absolute left-0 top-[40px] w-full bg-white rounded shadow-md mt-1 z-10">
                    {options.map((option) => (
                        <li
                            key={option}
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                            onMouseOver={() => {
                                onChange(option);
                            }}
                            className="flex justify-center py-2 hover:bg-yellow-500 cursor-pointer"
                        >
                            {displayText[option]}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TagSelector;
