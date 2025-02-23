import { useTextSelection } from '@/context/TextSelectionContext';
import { TextAlignJustifyCenterIcon, TextAlignJustifyLeftIcon, TextAlignJustifyRightIcon } from '@/icons';
import React, { useState } from 'react'


const JustifyToggler = () => {
    const [selectedAlignment, setSelectedAlignment] = useState<string>('start');
    const { selectedText } = useTextSelection()

    const handleJustifyClick = (alignment: string) => {
        const value = selectedText?.mainElement.classList
        if (value) {
            // Remove any existing justify-related classes before toggling
            value.remove("flex", "justify-center", "justify-start", "justify-end");
            // Add the clicked alignment class
            value.add('flex', `justify-${alignment}`);
            setSelectedAlignment(alignment);
        }
    };

    return (
        <div className="flex gap-2 mr-3">
            <span
                className={`hover:bg-yellow-500 p-2 rounded cursor-pointer ${selectedAlignment === 'start' ? 'active' : ''}`}
                onClick={() => handleJustifyClick('start')}
            >
                <TextAlignJustifyLeftIcon color="white" />
            </span>
            <span
                className={`hover:bg-yellow-500 p-2 rounded cursor-pointer ${selectedAlignment === 'center' ? 'active' : ''}`}
                onClick={() => handleJustifyClick('center')}
            >
                <TextAlignJustifyCenterIcon color="white" />
            </span>
            <span
                className={`hover:bg-yellow-500 p-2 rounded cursor-pointer ${selectedAlignment === 'end' ? 'active' : ''}`}
                onClick={() => handleJustifyClick('end')}
            >
                <TextAlignJustifyRightIcon color="white" />
            </span>
        </div>
    );
}

export default JustifyToggler;
