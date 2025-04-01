import React, { useEffect } from 'react'

// importing utils
import restoreSelection from '@/utils/restoreSelection';
import applyStyle from '@/utils/applyStyle'
import checkSelectedStyle from '@/utils/checkSelectedStyle';

// importing components
import TagSelector from './TagSelector';
import Conditional from '../Conditional';
import JustifyToggler from './JustifyToggler';
import useTextStyling from '@/hooks/useTextStyling';
import ToolbarButton from './ToolBarButton';
import { TextBoldIcon, TextItalicIcon, TextStrikethroughIcon, TextUnderlineIcon } from '@/icons';
import LinkPanelContainer from './LinkPanelContainer';
import { useTextSelection } from '@/context/TextSelectionContext';
import useTextState from '@/hooks/useTextState';


const ControlPanel = () => {
    const { selectedText, handleTextSelect } = useTextSelection()
    const { handleTextChange } = useTextState()

    const { stylingState, setStylingState } = useTextStyling(selectedText)

    const handleChangeTagName = (newTag: string) => {
        // store the old state element
        const oldElement = selectedText?.mainElement
        const editor = document.getElementById("editor")

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

        handleTextChange(editor?.innerHTML as string)

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
                    applyStyle('font-bold', stylingState.bold, selectedText);
                    break;
                case 'i':
                    applyStyle('italic', stylingState.italic, selectedText);
                    break;
                case 'u':
                    applyStyle('underline', stylingState.underline, selectedText);
                    break;
                case 's':
                    applyStyle('line-through', stylingState.lineThrough, selectedText);
                    break;
                case '`':
                    applyStyle('code', stylingState.code, selectedText);
                    break;
                default:
                    break;
            }
        }
    };

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
        <div className='bg-white shadow-md rounded-lg w-full px-9 flex flex-row gap-4 justify-between py-2'>
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

                <LinkPanelContainer />

            </div>

            <Conditional showWhen={!!selectedText?.mainElement}>
                <div className='flex items-center h-full w-full'>
                    <JustifyToggler />
                    <TagSelector onChange={handleChangeTagName} />
                </div>
            </Conditional>
        </div>
    )
}

export default ControlPanel