import { TextAlignJustifyCenterIcon, TextAlignJustifyLeftIcon, TextAlignJustifyRightIcon } from '@/icons';
import React, { useState } from 'react'

interface JustifyTogglerProps {
    value: DOMTokenList | null | undefined
}

const JustifyToggler = ({ value }: JustifyTogglerProps) => {
    const [selectedAlignment, setSelectedAlignment] = useState<string>('start');

    const handleJustifyClick = (alignment: string) => {
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
                className={`hover:bg-yellow-500 p-2 rounded cursor-pointer ${selectedAlignment === 'start' ? 'bg-yellow-700' : ''}`}
                onClick={() => handleJustifyClick('start')}
            >
                <TextAlignJustifyLeftIcon color="white" />
            </span>
            <span
                className={`hover:bg-yellow-500 p-2 rounded cursor-pointer ${selectedAlignment === 'center' ? 'bg-yellow-600' : ''}`}
                onClick={() => handleJustifyClick('center')}
            >
                <TextAlignJustifyCenterIcon color="white" />
            </span>
            <span
                className={`hover:bg-yellow-500 p-2 rounded cursor-pointer ${selectedAlignment === 'end' ? 'bg-yellow-600' : ''}`}
                onClick={() => handleJustifyClick('end')}
            >
                <TextAlignJustifyRightIcon color="white" />
            </span>
        </div>
    );
}

export default JustifyToggler;
