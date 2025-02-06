"use client"

import { restoreSelection } from '@/utils/restoreSelection';
import React, { useEffect, useRef, useState } from 'react'

const DragDropHorizontalIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg id='dragButton' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"} {...props}>
        <path d="M18 8V8.00635M12 8V8.00635M6 8L6 8.00635M18 15.9937V16M12 15.9937V16M6 15.9937L6 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

interface DropPositionProps {
    position: "before" | "after" | "between" | "inside",
    fromElement: Element | null,
    charIndex: number,
    dropDirection?: "left" | "right"
}

interface EditorProps {
    textHTML: string
    handleTextChange: (newHtml: string) => void
    handleTextSelect: () => void
}

const Editor = ({ textHTML, handleTextChange, handleTextSelect }: EditorProps) => {

    // ref на едітор для подальшого додавання елементів та івентів до нього
    const editorRef = useRef<HTMLDivElement>(null)
    const selection = window.getSelection();

    // керування css draggable button через стейт
    const [draggButtonTopPosition, setDraggButtonTopPosition] = useState<number>(0)
    const [draggButtonVisible, setDraggButtonVisible] = useState<boolean>(false)
    const [isTextDragged, setIsTextDragged] = useState<boolean>(false)
    const draggButtonStyles = {
        top: `${draggButtonTopPosition}px`,
        opacity: draggButtonVisible ? "1" : "0",
    };

    const [dropPosition, setDropPosition] = useState<DropPositionProps>({ position: "before", fromElement: null, charIndex: 0, dropDirection: "right" })

    const handleDraggStart = (e: DragEvent) => {
        const editor = editorRef.current
        if (!editor) return
        if (!selection) return

        // cause we leave dragged effect we need to clear it when we drag again
        const draggedBefore = editor.querySelector(".dragged")
        if (draggedBefore)
            draggedBefore.classList.remove("dragged")


        const draggableButton = e.target as EventTarget
        setDraggButtonVisible(false)
        const editorsElement = document.elementFromPoint(e.clientX + 100, e.clientY)
        // editorsElement now is a element we want to move around
        if (!editorsElement) return

        // make him draggable
        editorsElement.setAttribute("draggable", "true");
        editorsElement.classList.add("dragged")

        e.dataTransfer?.setDragImage(editorsElement, 0, -10);

        const handleDraggEnd = () => {
            editorsElement.removeAttribute("draggable")
        }


        // clear dragged effect after clicking on editor
        const handleClick = () => {
            editorsElement.classList.remove("dragged")
        }

        draggableButton.addEventListener("dragend", handleDraggEnd)
        editor.addEventListener("click", handleClick)

    }


    const handleMouseMove = (event: MouseEvent) => {
        const editor = editorRef.current;
        if (!editor) return;

        // get mouse coords
        const mouseY = event.clientY;
        const mouseX = event.clientX;

        // if we moved far right we hide drag button
        if (mouseX >= 700) {
            setDraggButtonVisible(false)
            return
        }

        // get element we point when dragged
        let hoveredElement = document.elementFromPoint(mouseX, mouseY);

        // if the pointed element is drag button we show it
        if (hoveredElement?.id === "dragButton") {
            setDraggButtonVisible(true);
            return
        }

        // try to check for element to the right from padding if we on padding side
        if (hoveredElement?.id === "editor")
            hoveredElement = document.elementFromPoint(mouseX + 100, mouseY)

        // hide the button if no element or padding is hovered
        if (hoveredElement?.id === "editor") {
            setDraggButtonVisible(false);
            return

        }


        // if what we did hover is left from an element and not the editor as well
        if (hoveredElement && editor.contains(hoveredElement)) {
            const rect = hoveredElement?.getBoundingClientRect()
            setDraggButtonTopPosition(rect?.top - editor.getBoundingClientRect().top + 5)
            setDraggButtonVisible(true)
            return
        }

    };

    const getHoveredCharacter = (element: HTMLElement, mouseX: number, mouseY: number): { charIndex: number, direction: "left" | "right", xCoord: number } => {
        const range = document.createRange();
        // var to store neccesary info about what characted and where to place the dragged text
        const result: { charIndex: number, direction: "left" | "right", xCoord: number } = {
            charIndex: 0, direction: "left", xCoord: 0
        };
        // check for containing the character
        let minDistance = Infinity;

        // we retrieve all characters from text
        const text = element.textContent;
        if (!text) return result;

        const elementRect = element.getBoundingClientRect();


        for (let i = 0; i < text.length; i++) {
            // we check for exact character and ask for coords range of this character
            range.setStart(element.firstChild!, i);
            range.setEnd(element.firstChild!, i + 1);

            // getting coords
            const rect = range.getBoundingClientRect();
            // asking if we did hover it
            const distance = Math.abs(rect.left - mouseX) + Math.abs(rect.top - mouseY);

            if (distance < minDistance) {
                const middleOfCharacter = (rect.right + rect.left) / 2
                minDistance = distance;
                // store the index of character, where to place the character based on midLine and coords for ::after styling block
                result.charIndex = i;
                result.direction = middleOfCharacter - 2 < mouseX ? "right" : "left"
                result.xCoord = middleOfCharacter - 2 < mouseX ? rect.right - elementRect.left - 3 : rect.left - elementRect.left - 3

            }
        }

        return result;
    };

    const handleDraggOver = (event: DragEvent) => {
        event.preventDefault()
        // get mouse coordinates
        const mouseX = event.clientX
        const mouseY = event.clientY

        // get possible hoveredElement
        let hoveredElement = document.elementFromPoint(mouseX, mouseY)

        // if we didnot hover any element
        if (!hoveredElement) return


        // if we did hover padding spot or empty space of editor we past go right to cehck for element
        if (hoveredElement.id === "editor") {
            hoveredElement = document.elementFromPoint(mouseX + 100, mouseY)
        }

        // if still we have no element or it is still editor we go back
        if (!hoveredElement || hoveredElement.id === "editor") return

        // now we know that we did hover something and we clear styles on previous hovered element
        if (dropPosition.fromElement) {
            dropPosition.fromElement.classList.remove("add-before", "add-after", "add-between", "add-inside");
        }

        // Перевіряємо, чи можна працювати з hoveredElement як з HTMLElement
        if (isTextDragged && hoveredElement instanceof HTMLElement) {
            const symbol = getHoveredCharacter(hoveredElement, mouseX, mouseY);
            if (!symbol) return
            setDropPosition({ position: "inside", fromElement: hoveredElement, charIndex: symbol.charIndex, dropDirection: symbol.direction })
            hoveredElement.style.setProperty('--drop-left', `${symbol.xCoord}px`);
            hoveredElement.classList.add("add-inside")
            return
        }

        // get hovered element coords
        const elementRect = hoveredElement.getBoundingClientRect()

        // retrieve siblings
        const nextElement = hoveredElement.nextElementSibling
        const previousElement = hoveredElement.previousElementSibling

        if (!previousElement && mouseY <= elementRect.y + elementRect.height / 2) {

            // if we did hover upper part and element DOES NOT have previous sibling
            setDropPosition({ ...dropPosition, position: "before", fromElement: hoveredElement })
            hoveredElement.classList.add("add-before")

        } else if (previousElement && mouseY <= elementRect.y + elementRect.height / 2) {

            // if we did hover upper part and element DOES have previous sibling
            setDropPosition({ ...dropPosition, position: "between", fromElement: previousElement })
            previousElement.classList.add("add-between")

        } else if (!nextElement && mouseY > elementRect.y + elementRect.height / 2) {

            // if we did hover lower part and element DOES NOT have next sibling
            setDropPosition({ ...dropPosition, position: "after", fromElement: hoveredElement })
            hoveredElement.classList.add("add-after")

        } else if (nextElement && mouseY > elementRect.y + elementRect.height / 2) {

            // if we did hover lower part and element DOES have next sibling
            setDropPosition({ ...dropPosition, position: "between", fromElement: hoveredElement })
            hoveredElement.classList.add("add-between")

        }


    }

    const handleDragEnd = () => {
        // we always clear styles on hovered element stored in state
        if (dropPosition.fromElement) {
            dropPosition.fromElement.classList.remove("add-before", "add-after", "add-between", "add-inside");
        }
    }

    const handleDrop = (event: DragEvent) => {
        event.preventDefault()

        // if we did not hover any element in #editor
        if (!dropPosition.fromElement)
            return

        // remove all styling classes
        dropPosition.fromElement.classList.remove("add-before", "add-after", "add-between", "add-inside")

        const range = selection?.getRangeAt(0)

        // retrive data of selected TextNode and replace text in the drop place
        const draggedText: string = event.dataTransfer.getData("selectedText")
        const selectedNode: Node = selection?.getRangeAt(0).startContainer as Node
        let sameElementFlag: boolean = false

        if (draggedText && dropPosition.fromElement) {
            setIsTextDragged(false)
            // because we hold textNode we must compare it by checking the contain condition
            if (dropPosition.fromElement.contains(selectedNode)) {
                selectedNode.textContent = selectedNode.textContent.replace(draggedText, "")
                sameElementFlag = true
            }

            // now we decide what index is for dropping by dropDirection
            const insertIndex = dropPosition.dropDirection === "left"
                ? dropPosition.charIndex
                : dropPosition.charIndex + 1;

            // place the dragged text into dropElement
            if (dropPosition.fromElement.innerHTML === "<br>")
                dropPosition.fromElement.innerHTML = draggedText
            else {
                dropPosition.fromElement.innerHTML = dropPosition.fromElement.innerHTML.toString().slice(0, insertIndex) + draggedText + dropPosition.fromElement.innerHTML.toString().slice(insertIndex)
            }

            // remove the dragged text from initial element 
            const parentElement = selectedNode.parentElement
            if (selectedNode.textContent && selectedNode !== dropPosition.fromElement) {
                selectedNode.textContent = selectedNode.textContent.replace(draggedText, "")
            }

            // we cant leave the element empty so we put <br> into  
            if (parentElement && parentElement.textContent.trim() === "") {
                parentElement.innerHTML = "<br>"
            }

            // now we select the dropped text but in a new place
            const newTextNode = dropPosition.fromElement.childNodes[0] as Text

            // to remain selection if placing happens in itself
            const nothingChanged = draggedText === dropPosition.fromElement.textContent;

            // determine the start range based on different insertion cases
            let startRange = insertIndex;

            if (sameElementFlag && nothingChanged) {
                // if we insert the whole text in itself
                startRange = 0;
            } else if (sameElementFlag) {
                // 2 scenarios : partial self insert to the start and just inserting from foreign element  
                const exceedsLength = insertIndex + draggedText.length > dropPosition.fromElement.textContent?.length;
                startRange = exceedsLength ? insertIndex - draggedText.length : insertIndex;
            }

            const endRange = Math.min(insertIndex + draggedText.length, newTextNode.length);

            restoreSelection(dropPosition.fromElement as HTMLElement, startRange, endRange)


            // we save changes in popped stated
            if (editorRef.current)
                handleTextChange(editorRef.current.innerHTML)

            return
        }

        // retrieve data of dragged element
        const draggedElement = document.getElementsByClassName("dragged")[0];
        if (!draggedElement) return


        // if we drop dragged element on its place
        if (draggedElement === dropPosition.fromElement) {
            return
        }

        // remember the nextSibling before removing
        let currentNode = draggedElement.nextElementSibling
        // now we remove draggedElement from DOM
        draggedElement.remove()

        // insert before drop position element if we did hover it like that last time
        if (dropPosition.position === "before") {
            dropPosition.fromElement.parentNode?.insertBefore(draggedElement, dropPosition.fromElement)
        }

        // insert after drop position element if we did hover it like that last time
        if (dropPosition.position === "after") {
            dropPosition.fromElement.after(draggedElement)
        }

        // insert after drop position element if we did hover it like that last time
        if (dropPosition.position === "between") {
            dropPosition.fromElement.after(draggedElement)
        }


        // we save changes in popped stated
        if (editorRef.current)
            handleTextChange(editorRef.current.innerHTML)

        // if no sibling were found we just finish
        if (!currentNode) return

        // if we did select nothing
        if (range?.startContainer === range?.endContainer) return

        // add selected siblings after draggedElement
        let previousNode = draggedElement
        while (currentNode && currentNode !== range?.endContainer.parentElement) {
            const nextNode = currentNode.nextElementSibling as Element // next sibling
            previousNode.after(currentNode);
            previousNode = currentNode
            currentNode = nextNode;
        }

        // move the last node after loop
        if (currentNode) {
            previousNode.after(currentNode);
        }

        // we select all moved elements
        const newRange = document.createRange();
        newRange.setStartBefore(draggedElement);
        newRange.setEndAfter(currentNode);
        selection?.removeAllRanges();
        selection?.addRange(newRange);

        // we save changes in popped stated
        if (editorRef.current)
            handleTextChange(editorRef.current.innerHTML)


    }

    const handleTextDragStart = (event: DragEvent) => {
        if (!selection) return

        const selectedNode = selection.anchorNode;
        if (!selectedNode) return

        // get the real start and end of selected text
        const start = Math.min(selection.anchorOffset, selection.focusOffset);
        const end = Math.max(selection.anchorOffset, selection.focusOffset);

        // grab only selected part
        const selectedText = selectedNode.textContent?.slice(start, end);
        if (!selectedText) return

        // remember selected part
        event.dataTransfer.setData("selectedText", selectedText)
        setIsTextDragged(true)

    }



    useEffect(() => {
        const editor = editorRef.current;
        let lastPlaceholderNode: HTMLElement | null = null;

        // if we initialized empty editor
        if (editor && editor.childNodes.length === 0) {
            // we create paragraph with <br> to be able type in there
            const initialParagraph = document.createElement("p");
            initialParagraph.innerHTML = "<br>";
            initialParagraph.addEventListener("dragstart", handleTextDragStart)
            editor.appendChild(initialParagraph);
        }

        const handleSelectionChange = () => {

            // save selected text into popped state
            handleTextSelect()

            const editor = editorRef.current;
            if (!editor || !selection || !selection.anchorNode) return;

            const selectedNode = selection.anchorNode.nodeType === Node.TEXT_NODE
                ? selection.anchorNode.parentNode
                : selection.anchorNode;

            // Check if the selected node is a <p> inside the editor
            if (selectedNode instanceof HTMLElement && editor.contains(selectedNode)) {
                const isEmpty = selectedNode.innerHTML === "<br>" || selectedNode.textContent === "";

                // if we selected another node - previous one loses the attribtes
                if (lastPlaceholderNode && lastPlaceholderNode !== selectedNode) {
                    lastPlaceholderNode.removeAttribute("data-placeholder");
                    lastPlaceholderNode.classList.remove("empty");
                }

                // if element has text - it doesnt get the attributes
                if (isEmpty) {
                    selectedNode.setAttribute("data-placeholder", "Press '/' for commands");
                    selectedNode.classList.add("empty");
                } else {
                    selectedNode.removeAttribute("data-placeholder");
                    selectedNode.classList.remove("empty");
                }

                lastPlaceholderNode = selectedNode
            }
        };

        // Attach the selectionchange event
        document.addEventListener("selectionchange", handleSelectionChange);

        return () => {
            document.removeEventListener("selectionchange", handleSelectionChange);
        };
    }, []);


    const handleInput = () => {
        const editor = editorRef.current;

        // check if refs work
        if (!editor || !selection) return;

        // get node we typed
        const currentNode = selection.anchorNode;

        // if something went wrong
        if (!currentNode) return;

        // check if we typed or entered new line
        if (
            currentNode.nodeType === Node.TEXT_NODE ||
            (currentNode.nodeType === Node.ELEMENT_NODE && (currentNode as HTMLElement).tagName === "BR")
        ) {
            // we create paragraph whether with text we typed or with blank br 
            const paragraphNode = document.createElement("p");
            paragraphNode.innerHTML = currentNode.textContent || "<br>";
            // we use created paragraph above only if we typed directly to editor
            if (currentNode.parentNode === editor) {
                editor.replaceChild(paragraphNode, currentNode);
            }

            // we save changes in popped stated
            handleTextChange(editor.innerHTML)

            // we set selection pointer position to 1 letter right to avoid troubles
            selection.collapse(paragraphNode, 1);
        }
    };

    useEffect(() => {
        const editor = editorRef.current
        // we take state value if editor is running slow
        if (editor && editor.innerHTML !== textHTML) {
            editor.innerHTML = textHTML
        }
    }, [textHTML])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const editor = editorRef.current;

        if (!editor) return;
        // prevent deleting the initial paragraph
        if ((e.key === "Backspace" || e.key === "Delete") && editor.childNodes.length === 1 && !editor.childNodes[0].textContent) {
            e.preventDefault();
        }

        // entering br element
        if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault()
            const range = selection?.getRangeAt(0)
            if (!range) return

            // we insert br to the place user was
            const br = document.createElement("br");
            range.insertNode(br);

            // moving cursor to the br
            range.setStartAfter(br);
            range.collapse(true);
        }

        // create paragraph manually when pressing Enter key
        else if (e.key === "Enter") {
            e.preventDefault()
            const range = selection?.getRangeAt(0)
            if (!range) return

            const newParagraph = document.createElement("p");

            // we replace text after cursor to place it to the new paragraph 
            const tranferedText = range.startContainer.textContent?.slice(range.startOffset)
            if (tranferedText) {
                newParagraph.innerHTML = tranferedText
                range.startContainer.textContent = range.startContainer.textContent?.replace(tranferedText, "") || ""
            }
            else
                newParagraph.innerHTML = "<br>"

            newParagraph.addEventListener("dragstart", handleTextDragStart)


            const currentNode = range.startContainer;
            const currentElement = currentNode.nodeType === 3 ? currentNode.parentNode : currentNode;

            if (!currentElement) return

            currentElement.after(newParagraph)
            const newRange = document.createRange();
            newRange.setStart(newParagraph, 0);
            newRange.collapse(true);
            selection?.removeAllRanges();
            selection?.addRange(newRange);
        }

        // we save changes in popped stated
        handleTextChange(editor.innerHTML)
    }


    return (
        <div className='relative'>
            <div ref={editorRef} onMouseMove={handleMouseMove} onKeyDown={handleKeyDown} onDragOver={handleDraggOver} onDrop={handleDrop} onInput={handleInput} contentEditable id="editor" className='text-black focus:outline-none shadow-lg rounded-lg w-[600px] h-[400px] py-3 pl-12 pr-10 flex flex-col gap-7 selection:bg-orange-100'></div>
            <div onMouseMove={handleMouseMove} onDragStart={handleDraggStart} onDragEnd={handleDragEnd} draggable style={draggButtonStyles} className='dragButton'>
                <DragDropHorizontalIcon />
            </div>
        </div>

    )
}

export default Editor