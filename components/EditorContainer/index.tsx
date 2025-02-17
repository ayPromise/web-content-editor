import React, { PropsWithChildren, useState } from 'react'
import ControlPanel from '../ControlPanel';
import Editor from '../Editor';
import getTextNode from '@/utils/getTextNode';


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
    const [textHTML, setTextHTML] = useState<string>("<p><code>font-family:UAF-Memory</code></p>");
    // The currently selected text in the editor
    const [selectedText, setSelectedText] = useState<SelectedTextProps | null>(null);

    const handleTextSelect = () => {


        const selection = window.getSelection()
        if (!selection) return

        const editor = document.getElementById("editor")



        const selectedNode = selection.anchorNode;
        if (!selectedNode) return

        // get the real start and end of selected text
        const start = Math.min(selection.anchorOffset, selection.focusOffset);
        const end = Math.max(selection.anchorOffset, selection.focusOffset);

        if (!editor?.contains(selection.baseNode))
            return

        // extract the tag name of selection main element
        let lastChildofEditor = selection.baseNode
        while (lastChildofEditor.parentElement && lastChildofEditor.parentElement.id !== "editor")
            lastChildofEditor = lastChildofEditor.parentElement

        // extract info about basic node selected
        const aloneNode: SelectedNode = { node: selection.baseNode, startIndex: start, endIndex: end }

        const range = selection.getRangeAt(0)

        const startContainer = range.startContainer.childNodes[range.startOffset] || range.startContainer
        const endContainer = range.startContainer.childNodes[range.endOffset - 1] || range.endContainer


        if (range.startContainer !== range.endContainer) {
            const orderedNodes = []

            // extract info about possible multiple nodes selected
            let firstNode: SelectedNode = {
                node: startContainer,
                startIndex: range.startOffset,
                endIndex: startContainer.textContent?.length as number
            }

            const lastNode: SelectedNode = {
                node: endContainer,
                startIndex: 0,
                endIndex: range.endOffset
            }

            // extract the text node from element
            if (lastNode.node.nodeType !== Node.TEXT_NODE) {
                lastNode.node = getTextNode(lastNode.node as HTMLElement, lastNode.startIndex, lastNode.endIndex) as Text
                lastNode.startIndex = 0
                lastNode.endIndex = lastNode.node.textContent?.length as number
            }
            // extract the text node from element
            if (firstNode.node.nodeType !== Node.TEXT_NODE) {
                firstNode.node = getTextNode(firstNode.node as HTMLElement, firstNode.startIndex, firstNode.endIndex) as Text
                firstNode.startIndex = 0
                firstNode.endIndex = firstNode.node.textContent?.length as number
            }

            // we go from left to right to include every element to be wrapped in style
            while (firstNode.node !== lastNode.node) {
                orderedNodes.push(firstNode)
                if (!firstNode.node.parentElement?.nextSibling) break

                const nextSiblingTextNode = getTextNode(firstNode.node.parentElement.nextSibling as HTMLElement, 0, firstNode.node.parentElement.nextSibling.textContent?.length as number)
                if (!nextSiblingTextNode) break

                firstNode = { node: nextSiblingTextNode as Node, startIndex: 0, endIndex: nextSiblingTextNode.textContent?.length as number }
            }


            orderedNodes.push(lastNode)

            setSelectedText({ orderedNodes, multipleNodes: true, mainElement: lastChildofEditor })

        }
        else
            setSelectedText({ fromTextNode: aloneNode, mainElement: lastChildofEditor })

    }

    const handleTextChange = (newHTML: string) => {
        setTextHTML(newHTML);
    };

    return (
        <div className='flex flex-col gap-4'>
            <ControlPanel selectedText={selectedText} handleTextSelect={handleTextSelect} />
            <Editor textHTML={textHTML} handleTextChange={handleTextChange} handleTextSelect={handleTextSelect} />
            {children}
        </div>
    )
}

export default EditorContainer 