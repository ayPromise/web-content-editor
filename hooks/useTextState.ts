import { useState, useEffect } from "react";

const useTextState = () => {
    const LOCAL_STORAGE_KEY = "editableTextHTML";

    const [textHTML, setTextHTML] = useState<string>(() => {
        return localStorage.getItem('') ||
            "<p><a href='https://youtube.com' target='_blank' rel='noopener noreferrer nofollow'>I want </a><span class='italic'>cursive </span>and bold <span class='font-bold'>text combined</span></p>";
    });

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, textHTML);
    }, [textHTML]);

    const handleTextChange = (newHTML: string) => {
        setTextHTML(newHTML);
    };

    return { textHTML, handleTextChange };
};

export default useTextState;
