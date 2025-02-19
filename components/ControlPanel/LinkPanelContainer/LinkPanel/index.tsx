import React, { useState } from 'react';

interface LinkPanelProps {
    value: string;
    onSubmit: (newUrl: string) => void;
}

const LinkPanel: React.FC<LinkPanelProps> = ({ value, onSubmit }) => {
    const [inputValue, setInputValue] = useState(value);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = () => {
        if (inputValue.trim()) {
            onSubmit(inputValue);
        }
    };

    return (
        <div className=" flex items-center bg-[#48442f] rounded" >
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                className="rounded-l py-1 px-2 bg-[#48442f] text-white flex-grow focus:outline-none border border-yellow-700"
                placeholder="Enter URL"
            />
            <button
                onClick={handleSubmit}
                className="px-2 py-1 border border-yellow-700 text-white rounded-r hover:bg-yellow-700 transition"
            >
                Submit
            </button>
        </div>
    );
};

export default LinkPanel;
