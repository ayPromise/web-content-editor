import { useTextSelection } from '@/context/TextSelectionContext';
import useTextState from '@/hooks/useTextState';
import { TextAlignJustifyCenterIcon, TextAlignJustifyLeftIcon, TextAlignJustifyRightIcon } from '@/icons';
import React, { useEffect, useState } from 'react'


const getAlignment = (element: HTMLElement | null): string => {
    if (!element) return "none";
    if (element.classList.contains("justify-center")) return "center";
    if (element.classList.contains("justify-end")) return "end";
    if (element.classList.contains("justify-start")) return "start";

    return 'none';
};

const JustifyToggler = () => {
    const { selectedText } = useTextSelection()
    const [selectedAlignment, setSelectedAlignment] = useState<string>(() => getAlignment(selectedText?.mainElement));
    const { handleTextChange } = useTextState()

    const handleJustifyClick = (alignment: string) => {
        const value = selectedText?.mainElement.classList
        const editor = document.getElementById("editor")
        if (value) {
            value.remove("flex", "justify-center", "justify-start", "justify-end");
            value.add('flex', `justify-${alignment}`);
            setSelectedAlignment(alignment);
            handleTextChange(editor?.innerHTML as string)
        }
    };

    useEffect(() => {
        setSelectedAlignment(getAlignment(selectedText?.mainElement))
    }, [selectedText]);

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
