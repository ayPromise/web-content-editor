import React, { PropsWithChildren } from 'react'
import ControlPanel from '../ControlPanel';
import Editor from '../Editor';
import useTextState from '@/hooks/useTextState';
import { TextSelectionProvider } from '@/context/TextSelectionContext';


export interface SelectedNode {
    node: Node,
    startIndex: number,
    endIndex: number
}

export interface SelectedTextProps {
    fromTextNode?: SelectedNode,
    multipleNodes?: boolean,
    orderedNodes?: SelectedNode[],
    mainElement: HTMLElement
}

const EditorContainer = ({ children }: PropsWithChildren) => {
    // The HTML content of the editor (could be initialized with default HTML)
    const { textHTML, handleTextChange } = useTextState();

    return (
        <TextSelectionProvider>
            <div className='flex flex-col gap-4'>
                <ControlPanel />
                <Editor textHTML={textHTML} handleTextChange={handleTextChange} />
                {children}
            </div>
        </TextSelectionProvider>
    )
}

export default EditorContainer 