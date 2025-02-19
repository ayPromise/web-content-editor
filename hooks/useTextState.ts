import { useState } from "react";

const useTextState = () => {
    const [textHTML, setTextHTML] = useState<string>(
        "<p>I want <span class='italic'>cursive </span>and bold <span class='font-bold'>text combined</span></p>"
    );

    const handleTextChange = (newHTML: string) => {
        setTextHTML(newHTML);
    };

    return { textHTML, handleTextChange };
};

export default useTextState;
