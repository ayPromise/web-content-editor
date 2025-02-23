import { SelectedTextProps, useTextSelection } from "@/context/TextSelectionContext";
import React, { useEffect, useState } from "react";

interface LinkPanelProps {
    value: string;
    onSubmit: (newUrl: string) => void;
}

const LinkPanel: React.FC<LinkPanelProps> = ({ value, onSubmit }) => {
    const [inputValue, setInputValue] = useState(value);
    const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = () => {
        if (inputValue.trim()) {
            onSubmit(inputValue);
        }
    };

    // Отримуємо координати тільки один раз при відкритті
    useEffect(() => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setPosition({
            top: rect.top + window.scrollY - 60, // Зсуваємо трохи вище
            left: rect.left + window.scrollX - rect.width,
        });
    }, []);

    return (
        <div
            className="absolute bg-white rounded shadow-lg p-2 border border-white flex items-center"
            style={{
                top: position.top,
                left: position.left,
                zIndex: 1000,
            }}
        >
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                className="rounded-l py-1 px-2 bg-[#867e57] text-white flex-grow focus:outline-none"
                placeholder="Enter URL"
            />
            <button
                onClick={handleSubmit}
                className="px-2 py-1 border border-white text-white rounded-r hover:bg-yellow-700 transition"
            >
                Submit
            </button>

            <div className="absolute size-3 bg-white rotate-45 border-b border-r border-white"
                style={{
                    top: 44,
                    left: position.left,
                    zIndex: 1000,
                }}></div>
        </div>
    );
};

export default LinkPanel;
