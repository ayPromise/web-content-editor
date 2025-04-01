import { useTextSelection } from "@/context/TextSelectionContext";
import React, { useEffect, useState } from "react";

interface LinkPanelProps {
    value: string;
    onSubmit: (newUrl: string) => void;
}

const LinkPanel: React.FC<LinkPanelProps> = ({ value, onSubmit }) => {
    const { selectedText } = useTextSelection()
    const [inputValue, setInputValue] = useState(value);
    const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = () => {
        const urlExpression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
        const regex = new RegExp(urlExpression)
        const urlValue = inputValue.trim()
        if (urlValue.match(regex)) {
            onSubmit(inputValue);
        } else {
            alert("Type the correct url")
        }
    };

    // Отримуємо координати тільки один раз при відкритті
    useEffect(() => {
        if (!selectedText) return

        const range = document.createRange();
        // render panel over the single element selected
        if (selectedText.fromTextNode) {
            const { node, startIndex, endIndex } = selectedText.fromTextNode
            range.setStart(node, startIndex);
            range.setEnd(node, endIndex);
        } else if (selectedText.orderedNodes) {
            // render the panel over the multiple elements selected 
            const firstObjElement = selectedText.orderedNodes[0]
            const lastObjElement = selectedText.orderedNodes[selectedText.orderedNodes?.length - 1]
            range.setStart(firstObjElement.node, firstObjElement.startIndex);
            range.setEnd(lastObjElement.node, lastObjElement.endIndex);
        }

        const rect = range.getBoundingClientRect();

        setPosition({
            top: rect.top + window.scrollY - 60,
            left: rect.left + window.scrollX - 30
        });
    }, []);

    return (
        <div
            className="absolute bg-white rounded shadow-lg p-2 border border-black flex items-center"
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
                className="rounded-l py-1 px-2 border flex-grow focus:outline-none"
                placeholder="Enter URL"
            />
            <button
                onClick={handleSubmit}
                className="px-2 py-1 border border-black rounded-r bg-[#F39200] hover:bg-[#f39200b8] transition"
            >
                Submit
            </button>

            <div className="absolute size-3 bg-white rotate-45 border-b border-r border-black"
                style={{
                    top: 44,
                    left: position.left / 3,
                    zIndex: 1000,
                }}></div>
        </div>
    );
};

export default LinkPanel;
