import React, { PropsWithChildren, useState } from 'react'
import ControlPanel from '../ControlPanel';
import Editor from '../Editor';


export interface SelectedTextProps {
    startIndex: number,
    endIndex: number,
    fromElement: HTMLElement
}

const EditorContainer = ({ children }: PropsWithChildren) => {
    // The HTML content of the editor (could be initialized with default HTML)
    const [textHTML, setTextHTML] = useState<string>("<p><br></p>");
    // The currently selected text in the editor
    const [selectedText, setSelectedText] = useState<SelectedTextProps | null>(null);

    const handleTextSelect = () => {
        const selection = window.getSelection()
        if (!selection) return

        const selectedNode = selection.anchorNode;
        if (!selectedNode) return

        // get the real start and end of selected text
        const start = Math.min(selection.anchorOffset, selection.focusOffset);
        const end = Math.max(selection.anchorOffset, selection.focusOffset);

        if (selectedNode.parentElement)
            setSelectedText({ startIndex: start, endIndex: end, fromElement: selectedNode.parentElement })
        else
            setSelectedText(null)
    }

    const handleTextChange = (newHTML: string) => {
        setTextHTML(newHTML);
    };

    return (
        <div className='flex flex-col gap-4'>
            <ControlPanel selectedText={selectedText} />
            <Editor textHTML={textHTML} handleTextChange={handleTextChange} handleTextSelect={handleTextSelect} />
            {children}
        </div>
    )
}

export default EditorContainer 