import React, { useEffect, useState } from 'react'
import { SelectedTextProps } from '../EditorContainer';
import { restoreSelection } from '@/utils/restoreSelection';
import { wrapSelectedText } from '@/utils/wrapSelectedText';
import mergingSameClassesElements from '@/utils/mergingSameClassesElements';
import disassembleElement from '@/utils/dissembleElements';
import restoreSelectionForMultipleNodes from '@/utils/restoreSelectionForMultipleNodes';
import checkSelectedStyle from '@/utils/checkSelectedStyle';
import TagSelector from './TagSelector';
import Conditional from '../Conditional';
import JustifyToggler from './JustifyToggler';

const TextBoldIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#000000"} fill={"none"} {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M5 6C5 4.58579 5 3.87868 5.43934 3.43934C5.87868 3 6.58579 3 8 3H12.5789C15.0206 3 17 5.01472 17 7.5C17 9.98528 15.0206 12 12.5789 12H5V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12.4286 12H13.6667C16.0599 12 18 14.0147 18 16.5C18 18.9853 16.0599 21 13.6667 21H8C6.58579 21 5.87868 21 5.43934 20.5607C5 20.1213 5 19.4142 5 18V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const TextItalicIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#000000"} fill={"none"} {...props}>
        <path d="M12 4H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 20L16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5 20H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const TextUnderlineIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#000000"} fill={"none"} {...props}>
        <path d="M5.5 3V11.5C5.5 15.0899 8.41015 18 12 18C15.5899 18 18.5 15.0899 18.5 11.5V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 21H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const TextStrikethroughIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#000000"} fill={"none"} {...props}>
        <path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17.5 7.66667C17.5 5.08934 15.0376 3 12 3C8.96243 3 6.5 5.08934 6.5 7.66667C6.5 8.15279 6.55336 8.59783 6.6668 9M6 16.3333C6 18.9107 8.68629 21 12 21C15.3137 21 18 19.6667 18 16.3333C18 13.9404 16.9693 12.5782 14.9079 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const SourceCodeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={18} height={18} color={"#000000"} fill={"none"} {...props}>
        <path d="M17 8L18.8398 9.85008C19.6133 10.6279 20 11.0168 20 11.5C20 11.9832 19.6133 12.3721 18.8398 13.1499L17 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 8L5.16019 9.85008C4.38673 10.6279 4 11.0168 4 11.5C4 11.9832 4.38673 12.3721 5.16019 13.1499L7 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.5 4L9.5 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

interface ControlPanelProps {
    selectedText: SelectedTextProps | null
    handleTextSelect: () => void
}

interface StylingStateProps {
    bold: boolean
    italic: boolean
    underline: boolean
    lineThrough: boolean
    code: boolean
}

const ControlPanel = ({ selectedText, handleTextSelect }: ControlPanelProps) => {

    const [stylingState, setStylingState] = useState<StylingStateProps>({
        bold: false, italic: false, underline: false, lineThrough: false, code: false
    })

    const handleApplyStyle = (style: string, isApplied: boolean) => {

        // if nothing was selected - we cant toggle boldness 
        if (!selectedText) return

        // dont apply styles for <code> element
        if (selectedText.fromTextNode?.node.parentElement?.tagName === "CODE") return

        // if (selectedText.fromTextNode?.startIndex === selectedText.fromTextNode?.endIndex) return

        // multiple nodes have another logic in styling
        const isMultiple: boolean | undefined = selectedText?.multipleNodes
        if (isMultiple) {
            ApplyStylesForMultipleNodes(style, isApplied)
            return
        }

        if (!selectedText.fromTextNode) return

        // extract from props the needed vars
        const { node, startIndex, endIndex } = selectedText.fromTextNode;

        // get the element of the selected text node
        const selectedElement: HTMLElement = node.parentElement as HTMLElement

        // get the info about if we select all the letters of the textNode
        const countOfLettersSelected = endIndex - startIndex
        const contentOfSelectedElement = selectedElement.textContent as string

        // remove styling
        if (isApplied) {

            // If only part of the element is selected, modify only that part
            if (contentOfSelectedElement.length !== countOfLettersSelected) {
                disassembleElement(selectedElement, startIndex, endIndex, style, isApplied, 'span')
                return;
            }

            selectedElement.classList.remove(style)

            if (!selectedElement.classList.length) {
                // if span has no more styles we can replace thatspan with ordinar textNode
                const newTextNode: Node = document.createTextNode(node.textContent as string);

                selectedElement.parentElement?.replaceChild(newTextNode, selectedElement);

                // Запам'ятовуємо parent перед normalize()
                const parent = newTextNode.parentElement as HTMLElement;



                // Повертаємо selection
                restoreSelection(newTextNode, startIndex, endIndex);

                // Об'єднуємо текстові вузли
                parent.normalize();
                return
            }

            mergingSameClassesElements(selectedElement)

            return
        }


        if (!node || node.nodeType !== Node.TEXT_NODE) return;

        if (!node.textContent) return

        // if it already has some classes 
        if (selectedElement.classList.length) {
            // If only part of the element is selected, modify only that part
            if (contentOfSelectedElement.length !== countOfLettersSelected) {

                // prevent disassembling the main element 
                disassembleElement(selectedText.mainElement === selectedElement ? node : selectedElement, startIndex, endIndex, style, isApplied, 'span')
                return;
            }
            selectedElement.classList.add(style)
            mergingSameClassesElements(selectedElement)
            return
        }

        // if it is empty textNode we wrap with new span

        const wrappedTextNode = wrapSelectedText(
            node,
            startIndex,
            endIndex,
            style
        );


        if (!wrappedTextNode) return

        mergingSameClassesElements(wrappedTextNode?.parentElement as HTMLElement)


    };

    const ApplyStylesForMultipleNodes = (style: string, isApplied: boolean) => {

        if (!selectedText?.orderedNodes?.length) return

        const { orderedNodes } = selectedText

        const disassembledArray: {
            fromElement: Node;
            startIndex: number;
            endIndex: number | undefined;
        }[] = []


        orderedNodes.forEach((nodeObject) => {

            if (nodeObject.node.parentElement?.tagName === "CODE") return

            let currentElement: HTMLElement = nodeObject.node

            if (currentElement.parentElement.parentElement && currentElement.parentElement.parentElement.id !== 'editor')
                currentElement = currentElement.parentElement


            const elementObj: {
                fromElement: Node;
                startIndex: number;
                endIndex: number | undefined;
            } = disassembleElement(currentElement, nodeObject.startIndex, nodeObject.endIndex, style, isApplied, 'span')

            disassembledArray.push(elementObj)
        })

        const first: {
            fromElement: Node;
            startIndex: number;
            endIndex: number | undefined;
        } = disassembledArray[0]

        const last: {
            fromElement: Node;
            startIndex: number;
            endIndex: number | undefined;
        } = disassembledArray[disassembledArray.length - 1]

        // there are cases when after merging element doesnt exist anymore

        if (!last || !last.fromElement.isConnected) {
            restoreSelection(first.fromElement, 0, first.fromElement.textContent?.length)
            return
        }

        if (!first || !first.fromElement.isConnected) {
            restoreSelection(last.fromElement, 0, last.fromElement.textContent?.length)
            return
        }

        if (!isApplied) {
            restoreSelectionForMultipleNodes(first.fromElement, last.fromElement, 0, last.fromElement.textContent?.length as number)
        } else {
            restoreSelectionForMultipleNodes(first.fromElement, last.fromElement, first.startIndex, last.endIndex as number)
        }

    }

    const handleChangeTagName = (newTag: string) => {
        const oldElement = selectedText?.mainElement
        const newElement = document.createElement(newTag)

        newElement.innerHTML = oldElement?.innerHTML
        newElement.classList.add(...Array.from(oldElement?.classList))
        oldElement?.after(newElement)
        oldElement?.remove()

        restoreSelection(newElement, 0, 0)
        handleTextSelect()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (!selectedText) return;
        if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            switch (event.key) {
                case 'b':
                    handleApplyStyle('font-bold', stylingState.bold);
                    break;
                case 'i':
                    handleApplyStyle('italic', stylingState.italic);
                    break;
                case 'u':
                    handleApplyStyle('underline', stylingState.underline);
                    break;
                case 's':
                    handleApplyStyle('line-through', stylingState.lineThrough);
                    break;
                case '`':
                    handleApplyStyle('code', stylingState.code);
                    break;
                default:
                    break;
            }
        }
    };

    const wrapToTheCodeTag = () => {
        if (!selectedText) return

        if (selectedText.multipleNodes) {
            return
        }

        if (!selectedText.fromTextNode) return
        const { node, startIndex, endIndex } = selectedText.fromTextNode

        if (node.parentElement?.tagName === "CODE") {
            const textNode = document.createTextNode(node.textContent)
            node.parentElement.after(textNode)
            node.parentElement.remove()
            restoreSelection(textNode as Node, 0, textNode.textContent?.length as number)
            selectedText.mainElement.normalize()
            return
        }
        const wrappedTextNode = wrapSelectedText(node, startIndex, endIndex, "", "CODE")

        restoreSelection(wrappedTextNode as Node, 0, wrappedTextNode?.textContent?.length as number)
    }


    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedText, stylingState]);


    useEffect(() => {
        const selectedElement = selectedText?.fromTextNode?.node.parentElement as HTMLElement
        const orderedList = selectedText?.orderedNodes
        const { bold, italic, underline, lineThrough } = checkSelectedStyle(selectedElement, orderedList)


        setStylingState({ ...stylingState, bold, italic, underline, lineThrough })
    }, [selectedText])


    return (
        <div className='bg-[#48442f] shadow-md rounded-lg w-full px-9 flex flex-row justify-between py-2'>
            <div className='flex gap-1 items-center'>
                <span className={`stylingButton ${stylingState.bold ? 'active' : ''}`} onClick={() => handleApplyStyle("font-bold", stylingState.bold)}><TextBoldIcon color='white' /></span>
                <span className={`stylingButton ${stylingState.italic ? 'active' : ''}`} onClick={() => handleApplyStyle("italic", stylingState.italic)}><TextItalicIcon color='white' /></span>
                <span className={`stylingButton ${stylingState.underline ? 'active' : ''}`} onClick={() => handleApplyStyle("underline", stylingState.underline)}><TextUnderlineIcon color='white' /></span>
                <span className={`stylingButton ${stylingState.lineThrough ? 'active' : ''}`} onClick={() => handleApplyStyle("line-through", stylingState.lineThrough)}><TextStrikethroughIcon color='white' /></span>
                <span className={`stylingButton ${stylingState.code ? 'active' : ''}`} onClick={wrapToTheCodeTag}><SourceCodeIcon color='white' /></span>
            </div>

            <Conditional showWhen={!!selectedText?.mainElement.tagName}>
                <div className='flex items-center -my-2'>
                    <JustifyToggler value={selectedText?.mainElement.classList} />
                    <TagSelector value={selectedText?.mainElement.tagName} onChange={handleChangeTagName} />
                </div>
            </Conditional>
        </div>
    )
}

export default ControlPanel