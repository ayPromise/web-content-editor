import React, { useEffect, useState } from 'react'
import { SelectedTextProps } from '../EditorContainer';
import { restoreSelection } from '@/utils/restoreSelection';
import { wrapSelectedText } from '@/utils/wrapSelectedText';

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
    selectedText: SelectedTextProps
}

interface StylingStateProps {
    bold: boolean
    italic: boolean
    underline: boolean
    strikeThrough: boolean
    code: boolean
}

const ControlPanel = ({ selectedText }: ControlPanelProps) => {

    const [stylingState, setStylingState] = useState<StylingStateProps>({
        bold: false, italic: false, underline: false, strikeThrough: false, code: false
    })

    const handleToggleBold = () => {
        const selection = window.getSelection()

        const { fromElement, startIndex, endIndex } = selectedText;


        if (!selectedText || !fromElement || !selection) return;

        // remove bold styling
        if (stylingState.bold) {
            const countOfLettersSelected = endIndex - startIndex
            const contentOfSelectedElement = fromElement.textContent as string

            // If only part of the element is selected, modify only that part
            if (contentOfSelectedElement.length !== countOfLettersSelected) {
                const span = wrapSelectedText(fromElement, startIndex, endIndex, "font-normal");

                if (span) {
                    const newStartIndex = startIndex - contentOfSelectedElement.slice(0, startIndex).length;
                    const newEndIndex = endIndex - contentOfSelectedElement.slice(0, startIndex).length;
                    restoreSelection(span, newStartIndex, newEndIndex);
                }
                return;
            }

            fromElement.classList.remove("font-bold")

            if (!fromElement.classList.length) {
                // if after reseting class we see that element is 'clear' we can remove it
                const TextNodeHtml: string = fromElement.innerHTML
                const newTextNode: Node = document.createTextNode(TextNodeHtml)
                fromElement.parentElement?.replaceChild(newTextNode, fromElement)


                // before normalizing we have calculate start and end selection indexes as well
                const previousTextNodeElement = newTextNode.previousSibling
                let start = startIndex
                let end = endIndex
                if (previousTextNodeElement && previousTextNodeElement.textContent?.length) {
                    start = previousTextNodeElement.textContent.length + startIndex
                    end = previousTextNodeElement.textContent.length + endIndex
                }

                // remember the parent element because normalizing will erase all nodes we knew
                const parent = newTextNode.parentElement as HTMLElement

                // we are operating with text nodes so better make sure they concatenate 
                parent.normalize()

                // after manipulating with DOM selection resets so we must take it back
                restoreSelection(parent, start, end)
            }

            return
        }

        // we are operating with text nodes so better make sure they concatenate 
        fromElement.normalize()

        const textNode = fromElement.firstChild;


        if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;

        if (!textNode.textContent) return

        const parentOfSelectedElement = fromElement.parentElement as HTMLElement
        // toggling bold back and dont have to create new span and use parents element instead
        if (parentOfSelectedElement.classList.contains("font-bold")) {

            // we must define selecting indexes before changing the DOM till its not too late
            const start = fromElement.previousSibling?.textContent?.length + startIndex
            const end = fromElement.previousSibling?.textContent?.length + endIndex


            // we replace element with text node
            parentOfSelectedElement.replaceChild(textNode, fromElement)

            // now element doesnt exist and we use node as a pointer
            parentOfSelectedElement.normalize()

            // after manipulating with DOM the selection resets so we must bring it back
            restoreSelection(parentOfSelectedElement, start, end)
            return
        }

        const wrappedElement = wrapSelectedText(
            fromElement,
            startIndex,
            endIndex,
            "font-bold"
        );

        if (!wrappedElement) return


        // after manipulating with DOM the selection resets so we must bring it back
        restoreSelection(wrappedElement, 0, wrappedElement.firstChild?.textContent?.length as number)

    };

    useEffect(() => {
        const pointedElement = selectedText?.fromElement.firstChild?.parentElement

        if (!pointedElement) return

        if (pointedElement.classList.contains("font-bold")) {
            setStylingState({ ...stylingState, bold: true })
        } else {
            setStylingState({ ...stylingState, bold: false })
        }
    }, [selectedText])


    // console.log(stylingState)

    return (
        <div className='bg-white shadow-md rounded-lg w-full px-9'>
            <div className='flex gap-1 items-center'>
                <span className={`stylingButton ${stylingState.bold ? 'active' : ''}`} onClick={handleToggleBold}><TextBoldIcon /></span>
                <span className='stylingButton'><TextItalicIcon /></span>
                <span className='stylingButton'><TextUnderlineIcon /></span>
                <span className='stylingButton'><TextStrikethroughIcon /></span>
                <span className='stylingButton'><SourceCodeIcon /></span>
            </div>
        </div>
    )
}

export default ControlPanel