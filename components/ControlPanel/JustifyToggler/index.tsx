import React, { useState } from 'react'

interface JustifyTogglerProps {
    value: DOMTokenList | null
}

const TextAlignJustifyCenterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"} {...props}>
        <path d="M3 3H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 15H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 21H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const TextAlignJustifyLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"} {...props}>
        <path d="M3 3H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 9H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 15H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 21H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const TextAlignJustifyRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"} {...props}>
        <path d="M13 3H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 9H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 15H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 21H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

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
                className={`hover:bg-yellow-500 p-2 rounded cursor-pointer ${selectedAlignment === 'start' ? 'bg-yellow-600' : ''}`}
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
