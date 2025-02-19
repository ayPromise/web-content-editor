import React, { useEffect } from 'react'

// importing utils
import restoreSelection from '@/utils/restoreSelection';
import wrapSelectedText from '@/utils/wrapSelectedText';
import applyStyle from '@/utils/applyStyle'
import checkSelectedStyle from '@/utils/checkSelectedStyle';

// importing components
import TagSelector from './TagSelector';
import Conditional from '../Conditional';
import JustifyToggler from './JustifyToggler';
import useTextStyling from '@/hooks/useTextStyling';
import ToolbarButton from './ToolBarButton';
import { SourceCodeIcon, TextBoldIcon, TextItalicIcon, TextStrikethroughIcon, TextUnderlineIcon } from '@/icons';
import LinkPanelContainer from './LinkPanelContainer';
import { useTextSelection } from '@/context/TextSelectionContext';


const ControlPanel = () => {
    const { selectedText } = useTextSelection()

    const { stylingState, setStylingState } = useTextStyling(selectedText)

    const handleChangeTagName = (newTag: string) => {
        // store the old state element
        const oldElement = selectedText?.mainElement

        // change nothing when we set current tag
        if (newTag === oldElement?.tagName) return

        // create a var for storing the new element with different newTag
        const newElement = document.createElement(newTag)

        // share the content and styles with new temp var
        newElement.innerHTML = oldElement?.innerHTML
        newElement.classList.add(...Array.from(oldElement?.classList))

        // render new element after the old one and remove it instantly
        oldElement?.after(newElement)
        oldElement?.remove()

        // put cursor pointer on the start of the new element
        restoreSelection(newElement, 0, 0)
        // call the handler for stating the selection value
        handleTextSelect()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (!selectedText) return;
        // added key combination to use the aplying styles functions
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

        // we cant make multiple nodes as code element
        if (selectedText.multipleNodes) {
            return
        }

        // dont apply changes if we did select nothing
        if (selectedText.fromTextNode?.startIndex === selectedText.fromTextNode?.endIndex) return

        // to prevent eslint arguing
        if (!selectedText.fromTextNode) return

        const { node, startIndex, endIndex } = selectedText.fromTextNode

        // if it already has code tag we toggle it down making textNode
        if (node.parentElement?.tagName === "CODE") {
            const textNode = document.createTextNode(node.textContent)
            node.parentElement.after(textNode)
            node.parentElement.remove()
            restoreSelection(textNode as Node, 0, textNode.textContent?.length as number)
            selectedText.mainElement.normalize()
            return
        }

        // or we wrap it with <code> tags
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
        <div className='bg-[#48442f] shadow-md rounded-lg w-full px-9 flex flex-row gap-4 justify-between py-2'>
            <div className='flex gap-1 items-center'>
                <ToolbarButton isActive={stylingState.bold} onClick={() => applyStyle("font-bold", stylingState.bold, selectedText)}>
                    <TextBoldIcon color="white" />
                </ToolbarButton>

                <ToolbarButton isActive={stylingState.italic} onClick={() => applyStyle("italic", stylingState.italic, selectedText)}>
                    <TextItalicIcon color='white' />
                </ToolbarButton>

                <ToolbarButton isActive={stylingState.underline} onClick={() => applyStyle("underline", stylingState.underline, selectedText)}>
                    <TextUnderlineIcon color='white' />
                </ToolbarButton>

                <ToolbarButton isActive={stylingState.lineThrough} onClick={() => applyStyle("line-through", stylingState.lineThrough, selectedText)}>
                    <TextStrikethroughIcon color='white' />
                </ToolbarButton>

                <ToolbarButton isActive={stylingState.code} onClick={wrapToTheCodeTag}>
                    <SourceCodeIcon color='white' />
                </ToolbarButton>

                <LinkPanelContainer selectedText={selectedText} onApply={(url) => setStylingState({ ...stylingState, linkURL: url })} />

            </div>

            <Conditional showWhen={!!selectedText?.mainElement}>
                <div className='flex items-center h-full w-full'>
                    <JustifyToggler value={selectedText?.mainElement.classList} />
                    <TagSelector value={selectedText?.mainElement.tagName} onChange={handleChangeTagName} />
                </div>
            </Conditional>
        </div>
    )
}

export default ControlPanel